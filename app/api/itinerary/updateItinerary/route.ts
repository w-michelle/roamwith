import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const body = await request.json();

  const { dates, containers, itinId, dateLen, cards } = body.data;
  //new dates/intial render = create new containers and put all items in first container
  try {
    for (let i = 0; i < dateLen; i++) {
      if (i == 0) {
        await prisma.container.create({
          data: {
            itineraryId: itinId,
            cards: {
              connect: cards.map((card: any) => ({ id: card.id })),
            },
          },
        });
      } else {
        await prisma.container.create({
          data: {
            itineraryId: itinId,
            cards: {
              create: [],
            },
          },
        });
      }
    }

    //delete previous containers
    for (let i = 0; i < containers.length; i++) {
      await prisma.container.deleteMany({
        where: { id: containers[i].id },
      });
    }
    //update the dates
    await prisma.itinerary.update({
      where: { id: itinId },
      data: {
        startDate: new Date(dates.startDate),
        endDate: new Date(dates.endDate),
      },
    });
    //return the new containers for itinerary
    const containersThisItin = await prisma.container.findMany({
      where: { itineraryId: itinId },
      include: {
        cards: {
          include: { listing: { include: { images: true } } },
        },
      },
    });

    return NextResponse.json(containersThisItin);
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}
