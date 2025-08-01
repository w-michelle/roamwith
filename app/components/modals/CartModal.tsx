"use client";

import { useModal } from "@/app/hooks/useModal";
import { SafeCart } from "@/types";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useCallback, useState } from "react";
import { Range } from "react-date-range";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

interface CartModalProp {
  cart?: SafeCart | null;
}

const CartModal: React.FC<CartModalProp> = ({ cart }) => {
  const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    key: "selection",
  };
  const modal = useModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const handleClose = useCallback(() => {
    modal.onClose();
  }, [modal.openModal]);

  const handleClearCart = () => {
    cart?.listings.forEach((item) => {
      handleRemoveFromCart(item.id);
    });

    return cart;
  };

  const createItinerary = () => {
    setIsLoading(true);

    axios
      .post("/api/itinerary/createItin", {
        cartId: cart?.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      .then((result: any) => {
        toast.success("Intinerary Created");
        modal.onClose();
        router.push(`/itinerary/${result.data.id}`);
        handleClearCart();
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRemoveFromCart = (listingId: string) => {
    axios
      .post(`/api/cart/removeFromCart/${listingId}`, { cartId: cart?.id })
      .then(() => {
        router.refresh();
      })
      .catch((error: any) => {
        toast.error(error?.reponse?.data?.error);
      });
  };
  if (modal.openModal !== "cart") {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="flex items-center justify-center fixed inset-0 bg-neutral-800/70 z-20"
    >
      <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
        <div
          className={`translate duration-300 h-full ${
            modal.openModal == "cart" ? "translate-y-0" : "translate-y-full"
          } ${modal.openModal == "cart" ? "opacity-100" : "opacity-0"}`}
        >
          {/* white modal */}

          <div className="py-6 translate h-full md:h-auto lg:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center px-6 pb-6 border-b-[1px]">
              <button
                onClick={handleClose}
                className="hover:opacity-60"
              >
                <IoMdClose size={18} />
              </button>
              <p className="mx-auto">Bucket</p>
            </div>

            {/* cart items */}
            {!cart?.listings[0] && (
              <div className="py-3 px-6 text-neutral-500">
                <p>No Bucket Items</p>
              </div>
            )}
            <div className="px-6 min-h-[400px] flex flex-col ">
              <div className="py-6 flex flex-col flex-1 max-h-[500px] overflow-y-scroll">
                {cart?.listings.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center gap-10 border-b-[1px] py-5 px-3"
                  >
                    <Image
                      src={item.images?.[0]?.url || "/imgplaceholder.png"}
                      width="50"
                      height="50"
                      alt="Item Picture"
                      className="object-fill"
                    />
                    <div>
                      <p>{item.title}</p>
                      <p className="text-neutral-500 w-[200px] truncate ">
                        {item.description}
                      </p>
                    </div>
                    <div
                      onClick={() => handleRemoveFromCart(item.id)}
                      className={`${
                        isLoading ? "cursor-not-allowed" : ""
                      } ml-auto rounded-full w-[20px] h-[20px] hover:cursor-pointer text-white hover:text-black hover:bg-neutral-500 bg-neutral-300 flex items-center justify-center`}
                    >
                      <IoMdClose />
                    </div>
                  </div>
                ))}
              </div>
              {/* button */}
              {cart?.listings[0] && (
                <div className="min-h-auto">
                  <button
                    onClick={() => createItinerary()}
                    disabled={isLoading}
                    className="w-full py-3 rounded-md disabled:cursor-not-allowed hover:bg-cusOrange/80 bg-cusOrange disabled:bg-cusOrange/30"
                  >
                    Create Itinerary
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
