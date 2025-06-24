import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { disconnect } from "process";
interface IParams {
  listingId: string;
}
export async function POST(request: Request, { params }: { params: IParams }) {
  const body = await request.json();
  const { cartId } = body;
  const { listingId } = params;
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  const cart = await prisma?.cart.update({
    where: { id: cartId, userId: currentUser.id },
    data: {
      listings: {
        disconnect: { id: listingId },
      },
    },
  });
  return NextResponse.json(cart);
}
