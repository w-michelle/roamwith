"use client";
import { formatCalDate } from "@/utils/formatDate";
import { Itinerary } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import { BeatLoader } from "react-spinners";
interface ItinContentProp {
  item: Itinerary;
}

const ItinContent: React.FC<ItinContentProp> = ({ item }) => {
  const router = useRouter();
  const [deleteUpdate, setDeleteUpdate] = useState(false);

  const handleDelete = (itinId: string) => {
    setDeleteUpdate(true);
    axios
      .delete("/api/itinerary/deleteItinerary", { data: { id: itinId } })
      .then(() => {
        toast.success("Itinerary deleted");
        // router.push("/myItineraries");
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setDeleteUpdate(false);
      });
  };
  if (deleteUpdate) {
    return (
      <>
        <div className="z-50 w-full absolute top-0 left-0 h-screen bg-neutral-300 opacity-50 backdrop-blur-sm "></div>
        <div className="z-50 w-full absolute top-0 left-0 h-screen flex flex-col gap-2 items-center justify-center">
          <p className="">Deleting</p>
          <BeatLoader
            size={10}
            color="black"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <li className="border-b-[1px] hover:bg-cusGreen/20 hover:rounded-md hover:opacity-70 border-neutral-500/70 flex justify-between px-2">
        <Link href={`/itinerary/${item.id}`}>
          <h3>{item.title || "Itinerary"}</h3>
        </Link>
        <div className="text-sm ml-auto">
          {formatCalDate(new Date(item.createdAt))}
        </div>

        <div onClick={() => handleDelete(item.id)}>
          <IoMdClose
            size={20}
            className="ml-3 text-neutral-400 hover:text-black cursor-pointer"
          />
        </div>
      </li>
    </>
  );
};

export default ItinContent;
