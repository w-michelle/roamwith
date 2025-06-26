"use client";

import { SafeCategory, SafeListing } from "@/types";
import React, { useEffect } from "react";
import { IoMdAdd } from "react-icons/io";

import ListingModal from "../../components/modals/ListingModal";
import EmptyState from "../../components/EmptyState";
import { AllListings } from "../../components/listing/AllListings";
import { useModal } from "@/app/hooks/useModal";
import { useRouter } from "next/navigation";

interface MainProp {
  listings: SafeListing[];
  categories?: SafeCategory[];
}
const Main: React.FC<MainProp> = ({ listings, categories }) => {
  const modal = useModal();

  return (
    <div className=" w-full">
      <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 w-full">
        <div
          onClick={() => modal.onOpen("listing")}
          className="hover:border-black hover:text-black text-neutral-500 hover:cursor-pointer min-w-[150px] h-[150px] border-2 border-neutral-200  rounded-xl shadow-md flex items-center justify-center"
        >
          <IoMdAdd size={28} />
        </div>
        <AllListings listings={listings} />
      </div>

      <div className="w-full flex items-center justify-center">
        {listings?.length === 0 && <EmptyState title="No listings yet" />}
      </div>
      {modal.openModal === "listing" && (
        <ListingModal categories={categories} />
      )}
    </div>
  );
};

export default Main;
