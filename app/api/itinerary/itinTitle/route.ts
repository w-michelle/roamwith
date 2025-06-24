import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
export async function POST(request: Request) {
  const body = await request.json();
  const { title, itinId } = body;

  const updatedTitle = await prisma.itinerary.update({
    where: { id: itinId },
    data: {
      title: title,
    },
  });
  return NextResponse.json(updatedTitle);
}
