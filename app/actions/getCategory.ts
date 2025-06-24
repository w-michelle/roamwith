import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getCategory(userId: string) {
  try {
    const categories = await prisma?.category.findMany({
      where: { userId: userId },
      orderBy: {
        createdAt: "desc",
      },
    });
    const safeCategories = categories?.map((category) => ({
      ...category,
      createdAt: category.createdAt.toISOString(),
    }));
    return safeCategories;
  } catch (error: any) {
    throw new Error(error);
  }
}
