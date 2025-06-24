import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
export default async function getCurrentCategory(catId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }
  try {
    const category = await prisma?.category.findFirst({
      where: { id: catId, userId: currentUser.id },
    });
    if (!category) {
      return null;
    }
    return {
      ...category,
      createdAt: category.createdAt.toString(),
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
