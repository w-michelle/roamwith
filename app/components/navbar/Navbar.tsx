import React from "react";
import Logo from "./Logo";

import Cart from "./Cart";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/types";
import getCart from "@/app/actions/getCart";

import CartModal from "../modals/CartModal";

interface NavbarProps {
  currentUser: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = async ({ currentUser }) => {
  const cart = await getCart(currentUser?.id!);

  return (
    <div className="flex justify-between items-center p-3 border-b-[1px]">
      <Logo />
      <div className="flex items-end gap-4">
        <Cart cart={cart} />
        <UserMenu currentUser={currentUser} />
      </div>
    </div>
  );
};

export default Navbar;
