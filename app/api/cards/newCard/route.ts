import crypto from "crypto";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
const s3Client = new S3Client({
  region: process.env.A_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.A_ACCESS_KEY as string,
    secretAccessKey: process.env.A_SECRET_KEY as string,
  },
});
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }
  try {
    const formData = await request.formData();
    const imageFiles = formData.getAll("images") as Blob[];

    let data;

    if (imageFiles) {
      const imageSrcs = [];
      const randomImageName = (bytes = 32) =>
        crypto.randomBytes(bytes).toString("hex");

      for (const file of imageFiles) {
        const bufferFile = Buffer.from(await file.arrayBuffer());
        const imageName = randomImageName();
        const params = {
          Bucket: process.env.A_BUCKET_NAME,
          Key: imageName,
          Body: bufferFile,
          ContentType: file.type,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        imageSrcs.push(imageName);
      }

      data = {
        userId: currentUser?.id,
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        category: formData.get("categoryId")?.toString() || "",
        images: {
          create: imageSrcs.map((imagename: any) => ({
            imageKey: imagename,
            url: "",
          })),
        },
      };
    } else {
      data = {
        userId: currentUser?.id,
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        category: formData.get("categoryId")?.toString() || "",
        images: {
          create: [],
        },
      };
    }
    const newlisting = await prisma.listing.create({
      data: data,
    });

    const newCard = {
      userId: currentUser?.id,
      listingId: newlisting.id,
      startTime: "0000",
      endTime: "0000",
      itineraryId: formData.get("itineraryId")?.toString()!,
    };

    const container = await prisma.container.findFirst({
      where: { id: formData.get("containerId")?.toString() },
      include: {
        cards: true,
      },
    });
    let combinedCard = [];

    if (container?.cards) {
      combinedCard = [...container?.cards, newCard];
    } else {
      combinedCard = [newCard];
    }

    const updatedContainer = await prisma.container.update({
      where: { id: formData.get("containerId")?.toString() },
      data: {
        cards: {
          deleteMany: {},
          create: combinedCard?.map((card: any) => ({
            userId: card.userId,
            listingId: card.listingId,
            startTime: card.startTime,
            endTime: card.endTime,
            itineraryId: card.itineraryId,
          })),
        },
      },
    });

    return NextResponse.json(updatedContainer);
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}
