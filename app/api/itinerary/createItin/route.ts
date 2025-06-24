import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { cartId, startDate, endDate } = body;

  if (!currentUser) {
    return NextResponse.error();
  }

  const cart = await prisma?.cart.findFirst({
    where: { id: cartId },
    include: {
      listings: true,
    },
  });

  if (!cart || !cart.listings) {
    return NextResponse.error();
  }

  const itinerary = await prisma?.itinerary.create({
    data: {
      userId: currentUser.id,
      startDate: startDate,
      endDate: endDate,
      container: {
        create: [],
      },
    },
  });

  let cardList = [];

  for (let i = 0; i < cart?.listings?.length; i++) {
    const newCard = await prisma?.card.create({
      data: {
        userId: currentUser.id,
        listingId: cart.listings[i].id,
        itineraryId: itinerary.id,
        startTime: "0000",
        endTime: "0000",
      },
    });
    cardList.push(newCard);
  }

  await prisma?.itinerary.update({
    where: { id: itinerary.id },
    data: {
      cards: {
        connect: cardList.map((card) => ({ id: card.id })),
      },
    },
  });

  return NextResponse.json(itinerary);
}
