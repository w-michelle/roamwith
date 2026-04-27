import getCurrentUser from "../actions/getCurrentUser";
import { Footer } from "./_components/footer";
import Nav from "./_components/nav";
import Image from "next/image";
const MarketingLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="relative z-10 rounded-lg">
        <Nav currentUser={currentUser} />
        <main className="pt-40">{children}</main>
      </div>{" "}
      <Footer />
    </div>
  );
};

export default MarketingLayout;
