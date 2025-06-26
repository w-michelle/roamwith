import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { revalidatePath } from "next/cache";
export async function POST(request: Request) {
  const body = await request.json();
  const { itinId, containerId, reorderedCards } = body.data;

  try {
    const existingContainer = await prisma.container.findFirst({
      where: { id: containerId, itineraryId: itinId },
    });
    if (!existingContainer) {
      throw new Error("Container not found");
    }

    const updatedContainer = await prisma.container.update({
      where: { id: existingContainer.id },
      data: {
        order: existingContainer.order,
        cards: {
          deleteMany: {},
          create: reorderedCards.map((card: any) => ({
            order: card.order,
            startTime: card.startTime,
            endTime: card.endTime,
            listingId: card.listingId,
            userId: card.userId,
            itineraryId: itinId,
          })),
        },
      },
    });
    revalidatePath("/itinerary/[itineraryId]", "page");
    return NextResponse.json(updatedContainer);
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}
