import { SafeListing } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
interface ListingProp {
  listing: SafeListing;
  handleAddToCart: (listing: SafeListing) => void;
  handleDeleteListing: (listingId: string) => void;
}
const Listing: React.FC<ListingProp> = ({
  listing,
  handleAddToCart,
  handleDeleteListing,
}) => {
  const [toggleMini, setToggleMini] = useState(false);
  const router = useRouter();

  const handleAdd = (listing: SafeListing) => {
    handleAddToCart(listing);
    setToggleMini(false);
  };
  const handleDelete = (id: string) => {
    handleDeleteListing(id);
    setToggleMini(false);
  };
  return (
    <>
      <div
        onClick={() => setToggleMini(!toggleMini)}
        className="hover:cursor-pointer w-full flex justify-end mb-2"
      >
        <BsThreeDots size={18} />
      </div>
      <div onClick={() => router.push(`/listing/${listing.id}`)}>
        <div className="relative w-[150px] h-[150px]">
          <Image
            src={listing.images[0]?.url || "/imgplaceholder.png"}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="w-[140px] truncate">
          <p className="mt-2">{listing.title}</p>
          <p className="text-xs text-neutral-500">{listing.description}</p>
        </div>
      </div>

      {/* mini action bar */}
      {toggleMini === true && (
        <div className="absolute top-9 right-[-50px] z-10">
          <div className="rounded-md bg-white flex flex-col gap-2 p-2 text-xs items-center shadow-md">
            <div
              onClick={() => handleAdd(listing)}
              className="hover:cursor-pointer hover:bg-neutral-300/30 py-1 px-3 w-full"
            >
              ADD TO BUCKET
            </div>

            <div
              onClick={() => handleDelete(listing.id)}
              className="hover:cursor-pointer hover:bg-neutral-300/30 py-1 px-3 w-full"
            >
              DELETE
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Listing;
