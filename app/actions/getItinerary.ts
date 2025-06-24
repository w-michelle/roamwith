import { Listing } from "@prisma/client";
import getCurrentUser from "./getCurrentUser";
import prisma from "@/app/libs/prismadb";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.A_ACCESS_KEY as string,
    secretAccessKey: process.env.A_SECRET_KEY as string,
  },
});
export const dynamic = "force-dynamic";
export default async function getItinerary(id: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const itinerary = await prisma?.itinerary.findUnique({
      where: { id: id, userId: currentUser.id },
      include: {
        cards: {
          include: { listing: { include: { images: true } } },
        },
        container: {
          include: {
            cards: {
              include: { listing: { include: { images: true } } },
              orderBy: { order: "asc" },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!itinerary) {
      return null;
    }
    //there is cards separate from container and also cards inside container(the next one) have to fetch for both, this is for cards, loop through each and fetch url from aws
    for (let i = 0; i < itinerary.cards.length; i++) {
      for (let j = 0; j < itinerary.cards[i].listing.images.length; j++) {
        const params = {
          Bucket: process.env.A_BUCKET_NAME,
          Key: itinerary.cards[i].listing.images[j].imageKey,
        };
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });
        itinerary.cards[i].listing.images[j].url = url;
      }
    }
    //loop through each container and within each container loop through each card to fetch the image url from aws
    if (itinerary.container.length > 0) {
      for (let i = 0; i < itinerary.container?.length; i++) {
        for (let k = 0; k < itinerary.container[i].cards.length; k++) {
          for (
            let j = 0;
            j < itinerary.container[i].cards[k].listing.images.length;
            j++
          ) {
            const params = {
              Bucket: process.env.A_BUCKET_NAME,
              Key: itinerary.container[i].cards[k].listing.images[j].imageKey,
            };
            const command = new GetObjectCommand(params);
            const url = await getSignedUrl(s3Client, command, {
              expiresIn: 3600,
            });
            itinerary.container[i].cards[k].listing.images[j].url = url;
          }
        }
      }
    }

    const safeItinerary = {
      ...itinerary,

      createdAt: itinerary.createdAt.toISOString(),
      startDate: itinerary.startDate.toISOString(),
      endDate: itinerary.endDate.toISOString(),
    };

    return safeItinerary;
  } catch (error: any) {
    throw new Error(error);
  }
}
