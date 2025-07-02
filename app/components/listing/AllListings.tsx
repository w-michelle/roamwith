"use client";

import { SafeListing } from "@/types";
import axios from "axios";

import { useRouter } from "next/navigation";
import React, { Suspense, useState } from "react";
import toast from "react-hot-toast";

import Listing from "./Listing";
import { useModal } from "@/app/hooks/useModal";
import Loading from "@/app/loading";

interface AllListingProps {
  listings: SafeListing[];
}

export const AllListings: React.FC<AllListingProps> = async ({ listings }) => {
  return (
    <Suspense fallback={<AllListingsSkeleton />}>
      <AllListingsSuspense listings={listings} />
    </Suspense>
  );
};

const AllListingsSkeleton = () => {
  const blocks = Array.from({ length: 15 });

  return (
    <div className="flex justify-center sm:justify-start gap-4 flex-wrap">
      {blocks.map((_, index) => (
        <div
          key={index}
          className="relative hover:cursor-pointer border-2 border-neutral-200 p-3 rounded-xl shadow-md bg-neutral-300 animate-pulse"
        >
          <div className="relative w-[150px] h-[150px]"></div>
        </div>
      ))}
    </div>
  );
};

const AllListingsSuspense: React.FC<AllListingProps> = ({ listings }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const modal = useModal();
  const handleAddToCart = (item: any) => {
    setLoading(true);
    axios
      .post("/api/cart/addToCart", item)
      .then(() => {
        toast.success("Added to bucket!");
        router.refresh();
        modal.onOpen("cart");
      })
      .catch((error: any) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteListing = (listingId: any) => {
    axios
      .delete(`/api/listings/deleteListing/${listingId}`)
      .then(() => {
        toast.success("Removed Listing");
        router.refresh();
      })
      .catch((error: any) => {
        toast.error("Something went wrong");
      });
  };
  if (loading) {
    return (
      <div className="opacity-50 bg-neutral-400 w-full h-screen absolute top-0 left-0">
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex justify-center sm:justify-start gap-4 flex-wrap">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="relative hover:cursor-pointer border-2 border-neutral-200 p-3 rounded-xl shadow-md"
        >
          <Listing
            listing={listing}
            handleAddToCart={(value: SafeListing) => handleAddToCart(value)}
            handleDeleteListing={(value: string) => handleDeleteListing(value)}
          />
        </div>
      ))}
    </div>
  );
};
