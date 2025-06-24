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
  try {
    const formData = await request.formData();

    const imageFiles = formData.getAll("images") as Blob[];
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
      const data = {
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

      const listing = await prisma?.listing.create({
        data: { ...data },
      });
      return NextResponse.json(listing);
    } else {
      const data = {
        userId: currentUser?.id,
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        category: formData.get("categoryId")?.toString() || "",
        images: {
          create: [],
        },
      };

      const listing = await prisma?.listing.create({
        data: { ...data },
      });
      return NextResponse.json(listing);
    }
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}
