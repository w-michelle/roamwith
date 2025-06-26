"use client";

import { SafeCard } from "@/types";
import Image from "next/image";
import { Draggable } from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { RiDraggable } from "react-icons/ri";
import { IoIosMore } from "react-icons/io";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BeatLoader } from "react-spinners";
import debounce from "lodash.debounce";
import { TimeSlot } from "./TimeSlot";

interface CardProps {
  card: SafeCard;
  index: number;
  cards: SafeCard[];
}

const Card: React.FC<CardProps> = ({ card, index, cards }) => {
  const found = cards.find((item) => item.id == card.id);

  const [toggleDelete, setToggleDelete] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();
  const [timeSlot, setTimeSlot] = useState({
    stb: card.startTime?.slice(0, 2) || "00",
    ste: card.startTime?.slice(2, 4) || "00",
    etb: card.endTime?.slice(0, 2) || "00",
    ete: card.endTime?.slice(2, 4) || "00",
  });

  const handleDelete = () => {
    axios
      .delete("/api/cards/removeCard", {
        data: { cardId: card.id, itinId: card.itineraryId },
      })
      .then(() => {
        toast.success("Card Removed");
        window.location.reload();
        router.refresh();
      })
      .catch((error: any) => {
        toast.error(error);
      });
  };

  //handle time change
  const handleTimeChange = (slot: string, value: string) => {
    const updated = { ...timeSlot, [slot]: value };
    setTimeSlot(updated);
    setIsUpdating(true);
    debounceTimeUpdate(updated);
  };

  const debounceTimeUpdate = useCallback(
    debounce((updateCardTime) => {
      axios
        .post("/api/cards/updateCardTime", {
          data: {
            cardId: card.id,
            timeSlot: updateCardTime,
            itinId: card.itineraryId,
          },
        })
        .then(() => {
          toast.success("Time Updated!");
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong"))
        .finally(() => setIsUpdating(false));
    }, 1000),
    [card.id, card.itineraryId]
  );

  if (isUpdating) {
    return (
      <>
        <div className="z-50 w-full fixed inset-0 h-screen bg-neutral-300 backdrop-blur-sm opacity-60"></div>
        <div className="z-50 w-full absolute top-0 left-0 h-screen flex flex-col gap-2 items-center justify-center">
          <p className="">Updating</p>
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
      <Draggable
        draggableId={card.id}
        index={index}
      >
        {(provided) => (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="flex flex-col sm:flex-row w-full gap-3 sm:gap-6"
          >
            <div className="flex items-center w-[100px]  bg-cusGrayBg/30 border-[1px] border-cusBorder text-cusText px-3 py-2 text-xs rounded-2xl">
              <TimeSlot
                handleTimeChange={handleTimeChange}
                timeSlot={timeSlot}
              />
            </div>
            <div className="flex items-center gap-2 justify-between w-full">
              <div className=" relative w-[50px] h-[50px] ml-2">
                {found?.listing.images[0] ? (
                  <Image
                    src={found?.listing.images[0].url}
                    alt="List Item Image"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src={"/imgplaceholder.png"}
                    alt="List Item Image"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <Link href={`/listing/${card.listingId}`}>
                  <div className="hover:underline">{card.listing.title}</div>
                </Link>

                <div className="text-cusText text-xs">
                  {card.listing.description}
                </div>
              </div>
              <div
                className="cursor-pointer relative"
                onClick={() => setToggleDelete(!toggleDelete)}
              >
                <IoIosMore className="text-cusText/50 hover:text-cusText" />
                {toggleDelete && (
                  <div
                    className="absolute rounded-md p-1 text-xs bg-red-400/50 hover:bg-red-800 hover:text-red-400"
                    onClick={handleDelete}
                  >
                    <div>Remove</div>
                  </div>
                )}
              </div>
              <div
                {...provided.dragHandleProps}
                className="ml-auto cursor-move"
              >
                <RiDraggable
                  size={20}
                  className="text-cusText/30 hover:text-cusText"
                />
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Card;
