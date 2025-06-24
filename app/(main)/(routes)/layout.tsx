import Navbar from "../../components/navbar/Navbar";
import ToasterProvider from "../../providers/ToasterProvider";
import getCurrentUser from "../../actions/getCurrentUser";

import Categorybar from "../../components/category/Categorybar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative">
      <ToasterProvider />

      <Navbar currentUser={currentUser} />
      <Categorybar currentUser={currentUser} />

      {children}
    </div>
  );
}
