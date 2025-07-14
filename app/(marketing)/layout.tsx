import getCurrentUser from "../actions/getCurrentUser";
import Nav from "./_components/nav";
import Image from "next/image";
const MarketingLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  return (
    <div className="relative ">
      {/* <div className="absolute top-0 left-0 w-full h-full z-[-99] opacity-20 ">
        <Image
          src="/hero.png"
          alt="travelling graphic"
          fill
          className="object-cover"
        />
      </div> */}
      <Nav currentUser={currentUser} />
      <main className="h-full pt-40">{children}</main>
    </div>
  );
};

export default MarketingLayout;
