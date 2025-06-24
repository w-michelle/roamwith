import getCurrentUser from "./getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
interface IParams {
  listingId?: string;
}

const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.A_ACCESS_KEY as string,
    secretAccessKey: process.env.A_SECRET_KEY as string,
  },
});
export const dynamic = "force-dynamic";
export default async function getListing(params: IParams) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }
  try {
    const { listingId } = params;

    const listing = await prisma?.listing.findFirst({
      where: {
        id: listingId,
        userId: currentUser.id,
      },
      include: {
        images: true,
      },
    });
    if (!listing) {
      return null;
    } else {
      for (let i = 0; i < listing.images.length; i++) {
        const params = {
          Bucket: process.env.A_BUCKET_NAME,
          Key: listing.images[i].imageKey,
        };
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });
        listing.images[i].url = url;
      }
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toString(),
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
