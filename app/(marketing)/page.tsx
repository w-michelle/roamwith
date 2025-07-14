import { getServerSession } from "next-auth";
import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import { Heading } from "./_components/heading";

import { Footer } from "./_components/footer";

import Image from "next/image";

export default async function Landing() {
  const session = await getServerSession();

  return (
    <div className=" h-screen flex flex-col ">
      <div className="relative flex-1 flex flex-col items-center text-center gap-y-8 px-6 ">
        <Heading user={session?.user} />
        <div className="absolute top-0 left-0 w-full h-full z-[-99] opacity-20 ">
          <Image
            src="/hero.png"
            alt="travelling graphic"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <Footer />
      <LoginModal />
      <RegisterModal />
    </div>
  );
}
