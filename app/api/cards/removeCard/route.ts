import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
export async function DELETE(request: Request) {
  const body = await request.json();

  const { cardId, itinId } = body;

  const card = await prisma?.card.delete({
    where: { id: cardId, itineraryId: itinId },
  });

  return NextResponse.json(card);
}
