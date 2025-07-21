import getCurrentUser from "../actions/getCurrentUser";
import Nav from "./_components/nav";
import Image from "next/image";
const MarketingLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  return (
    <div className="relative bg-gradient-to-b from-sky-50 via-orange-100 to-lime-100 z-[-99]">
      <Nav currentUser={currentUser} />
      <main className="h-full pt-40">{children}</main>
    </div>
  );
};

export default MarketingLayout;
