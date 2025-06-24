import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "@/app/libs/prismadb";

const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.A_ACCESS_KEY as string,
    secretAccessKey: process.env.A_SECRET_KEY as string,
  },
});

export const dynamic = "force-dynamic";
export default async function getCart(userId: string) {
  if (!userId) {
    return null;
  }

  try {
    const cart = await prisma?.cart.findFirst({
      where: { userId: userId },
      include: {
        listings: {
          include: {
            images: true,
          },
        },
      },
    });

    if (cart) {
      for (let i = 0; i < cart.listings.length; i++) {
        for (let j = 0; j < cart.listings[i].images.length; j++) {
          const params = {
            Bucket: process.env.A_BUCKET_NAME,
            Key: cart.listings[i].images[j].imageKey,
          };
          const command = new GetObjectCommand(params);
          const url = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });
          cart.listings[i].images[j].url = url;
        }
      }
      const safeListings = cart.listings.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      }));
      const safeCart = {
        ...cart,
        listings: safeListings,
        createdAt: cart.createdAt.toISOString(),
      };

      return safeCart;
    }
  } catch (error: any) {
    throw new Error(error);
  }
}
