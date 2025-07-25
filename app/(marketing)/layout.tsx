import getCurrentUser from "../actions/getCurrentUser";
import { Footer } from "./_components/footer";
import Nav from "./_components/nav";
import Image from "next/image";
const MarketingLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  return (
    <div className="h-screen relative bg-gradient-to-b from-sky-50 via-orange-100 to-lime-100 z-[-99]">
      <Nav currentUser={currentUser} />
      <main className="pt-40">{children}</main>
      <div className="absolute top-0 left-0 w-full h-full z-[-99] opacity-20 overflow-hidden">
        <Image
          src="/hero.png"
          alt="travelling graphic"
          fill
          className="object-cover"
        />
      </div>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
