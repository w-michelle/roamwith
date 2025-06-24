import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { title, icon } = body;

  const category = await prisma.category.create({
    data: {
      title,
      icon,
      userId: currentUser.id,
    },
  });
  return NextResponse.json(category);
}
