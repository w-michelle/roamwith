import { getServerSession } from "next-auth";
import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import { Heading } from "./_components/heading";

import Image from "next/image";

export default async function Landing() {
  const session = await getServerSession();

  return (
    <div className=" h-full flex flex-col ">
      <div className="relative flex-1 flex flex-col items-center text-center gap-y-8 px-6 ">
        <Heading user={session?.user} />
      </div>

      <LoginModal />
      <RegisterModal />
    </div>
  );
}
