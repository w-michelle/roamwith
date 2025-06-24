"use client";
import EditModal from "@/app/components/modals/EditModal";

import { useModal } from "@/app/hooks/useModal";
import { SafeCategory, SafeListing, SafeUser } from "@/types";
import { formatDate } from "@/utils/formatDate";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import { MdOutlineModeEdit } from "react-icons/md";

interface ListingClientProps {
  listing: SafeListing;
  currentUser: SafeUser;
  categories?: SafeCategory[];
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
  categories,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const modal = useModal();

  const router = useRouter();

  const handleDeleteImg = (imgId: string) => {
    setIsLoading(true);

    axios
      .delete("/api/listings/editListing", {
        data: {
          listingId: listing?.id,
          imgId: imgId,
        },
      })
      .then(() => {
        toast.success("Image deleted");
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleDeleteListing = () => {
    setIsLoading(true);
    axios
      .delete(`/api/listings/deleteListing/${listing.id}`)
      .then(() => {
        toast.success("Removed Listing");

        router.push("/");
        router.refresh();
      })
      .catch((error: any) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleAddToCart = () => {
    setIsLoading(true);
    axios
      .post("/api/cart/addToCart", listing)
      .then(() => {
        toast.success("Added to bucket!");
        router.refresh();
        modal.onOpen("cart");
      })
      .catch((error: any) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-4 p-3">
      <button
        onClick={() => handleAddToCart()}
        disabled={isLoading}
        className="ml-auto text-sm mb-4 py-2 w-[150px] bg-[#ade4bc] disabled:cursor-not-allowed hover:bg-[#60956e] hover:text-[#ade4bc] flex justify-center rounded-lg gap-2 items-center"
      >
        ADD TO BUCKET
      </button>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 mb-4">
          {listing?.images.map((image, index) => (
            <div
              key={image.id || index}
              className="group w-[100px] h-[150px] sm:w-[250px] sm:h-[250px] shadow-md hover:cursor-pointer hover:border-[1px] hover:border-neutral-500 overflow-hidden rounded-xl relative"
            >
              <Image
                src={image.url || "/imgplaceholder.png"}
                fill
                alt="Image of Listing"
                className="object-cover"
              />
              <div className="hidden group-hover:flex items-center justify-center text-white absolute top-0 right-0 rounded-full h-5 w-5 bg-red-400 hover:bg-red-700">
                <IoMdClose onClick={() => handleDeleteImg(image.id)} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="text-neutral-400">Title:</p>
          <p>{listing.title}</p>
        </div>
        <div>
          <p className="text-neutral-400">Details:</p>
          <p>{listing.description}</p>
        </div>
        <div>
          <p className="text-neutral-400">Created:</p>
          <p>{formatDate(listing.createdAt)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-sm mt-8">
        <button
          onClick={() => modal.onOpen("editListing")}
          disabled={isLoading}
          className="py-2 w-[100px] bg-neutral-200 disabled:cursor-not-allowed hover:bg-neutral-400 flex justify-center rounded-lg gap-2 items-center"
        >
          EDIT <MdOutlineModeEdit />
        </button>
        <button
          onClick={() => handleDeleteListing()}
          disabled={isLoading}
          className="py-2 w-[100px] disabled:cursor-not-allowed disabled:bg-red-400/20 bg-red-400/20 hover:bg-red-800 hover:text-red-400 flex justify-center rounded-lg gap-2 items-center"
        >
          DELETE
          <FaRegTrashAlt />
        </button>
      </div>
      <EditModal
        listing={listing}
        categories={categories}
      />
    </div>
  );
};

export default ListingClient;
