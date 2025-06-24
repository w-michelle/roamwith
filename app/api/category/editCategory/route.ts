import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }
  const body = await request.json();
  const { title, icon, catId } = body;

  const category = await prisma?.category.update({
    where: { id: catId },
    data: {
      title,
      icon,
    },
  });
  return NextResponse.json(category);
}

export async function DELETE(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { catId } = body;

  if (!catId) {
    throw new Error("Invalid Category");
  }

  await prisma?.category.delete({
    where: { id: catId },
  });

  const listing = await prisma?.listing.updateMany({
    where: { category: catId },
    data: {
      category: "All",
    },
  });
  return NextResponse.json(listing);
}
