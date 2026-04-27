import { getServerSession } from "next-auth";
import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import { Heading } from "./_components/heading";

import Image from "next/image";

export default async function Landing() {
  const session = await getServerSession();

  return (
    <div className="h-full flex flex-col ">
      <div className=" flex-1 flex flex-col items-center text-center gap-y-8 p-6 ">
        <Heading user={session?.user} />
        <div className=" flex items-center justify-center">
          <video
            className="w-3/4 md:w-2/3 bg-white rounded-2xl shadow-md drop-shadow-2xl p-6"
            autoPlay
            muted
            loop
          >
            <source
              src="/demo.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>

      <LoginModal />
      <RegisterModal />
    </div>
  );
}
