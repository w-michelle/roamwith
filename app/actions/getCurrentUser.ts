import { getServerSession } from "next-auth";
import prisma from "@/app/libs/prismadb";
import authOptions from "../api/auth/[...nextauth]/options";
export const dynamic = "force-dynamic";
export default async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  try {
    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });
    if (!currentUser) {
      return null;
    }
    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error: any) {
    return null;
  }
}
