"use client";

import { useModal } from "@/app/hooks/useModal";
import { SafeCart } from "@/types";
import React from "react";
import { LuLuggage } from "react-icons/lu";
import CartModal from "../modals/CartModal";
interface CartModalProp {
  cart?: SafeCart | null;
}

const Cart: React.FC<CartModalProp> = ({ cart }) => {
  const modal = useModal();

  return (
    <div>
      <button
        onClick={() => modal.onOpen("cart")}
        className="relative hover:cursor-pointer"
      >
        <LuLuggage
          size={25}
          className="relative"
        />
        {cart && (
          <span
            className={`absolute text-xs text-center top-[-4px] right-[-4px] ${
              cart?.listings.length > 0 ? "" : "hidden"
            } rounded-full bg-cusGreen h-2 w-2`}
          ></span>
        )}
      </button>
      {modal.openModal === "cart" && <CartModal cart={cart} />}
    </div>
  );
};

export default Cart;
