import getCurrentUser from "../actions/getCurrentUser";
import Nav from "./_components/nav";

const MarketingLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  return (
    <div className="h-full">
      <Nav currentUser={currentUser} />
      <main className="h-full pt-40">{children}</main>
    </div>
  );
};

export default MarketingLayout;
