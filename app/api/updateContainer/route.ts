import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const body = await request.json();

  const { dates, containers, itinId } = body.data;

  try {
    const existingItinerary = await prisma.itinerary.update({
      where: { id: itinId },
      data: {
        startDate: dates.startDate,
        endDate: dates.endDate,
        container: {
          updateMany: containers.map((container: any, index: any) => ({
            where: { id: container.id },
            data: {
              order: container.order,
            },
          })),
        },
      },
    });

    return NextResponse.json(existingItinerary);
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}
