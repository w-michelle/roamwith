import { getServerSession } from "next-auth";
import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import { Heading } from "./_components/heading";

import { Footer } from "./_components/footer";

export default async function Landing() {
  const session = await getServerSession();

  return (
    <div className=" h-screen flex flex-col ">
      <div className="flex-1 flex flex-col items-center text-center gap-y-8 px-6 ">
        <Heading user={session?.user} />
      </div>
      <Footer />
      <LoginModal />
      <RegisterModal />
    </div>
  );
}
