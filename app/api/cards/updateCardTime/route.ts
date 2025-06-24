import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { timeSlot, cardId, itinId } = body.data;

    const card = await prisma?.card.update({
      where: { id: cardId, itineraryId: itinId },
      data: {
        startTime: timeSlot.stb + timeSlot.ste,
        endTime: timeSlot.etb + timeSlot.ete,
      },
    });

    return NextResponse.json({ card }, { status: 200 });
  } catch (error) {
    console.error("Error updating card:", error);

    return NextResponse.json(
      { error: "Failed to update the card time slot" },
      { status: 500 }
    );
  }
}
