import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getCart() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const cart = await prisma?.cart.findFirst({
    where: { userId: currentUser.id },
    include: { listings: { include: { images: true } } },
  });

  if (cart) {
    const safeCart = { ...cart, createdAt: cart.createdAt.toISOString() };
    return safeCart;
  } else {
    return null;
  }
}
