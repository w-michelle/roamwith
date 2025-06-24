import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const body = await request.json();

  const { source, dest } = body.data;

  try {
    const updates = await prisma.$transaction(async (prisma) => {
      await Promise.all(
        source.cards.map((card: any) =>
          prisma.card.update({
            where: { id: card.id },
            data: { order: card.order, containerId: source.id },
          })
        )
      );

      await Promise.all(
        dest.cards.map((card: any) =>
          prisma.card.update({
            where: { id: card.id },
            data: { order: card.order, containerId: dest.id },
          })
        )
      );
    });
    return NextResponse.json(updates);
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}
