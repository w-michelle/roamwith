import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;

  try {
    const itinerary = await prisma.itinerary.delete({
      where: { id: id },
    });

    return NextResponse.json(itinerary);
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}
