import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
export default async function createCart() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const cart = await prisma?.cart.create({
    data: {
      userId: currentUser.id,
    },
  });
  const newCart = { ...cart, listings: [] };
  return newCart;
}
