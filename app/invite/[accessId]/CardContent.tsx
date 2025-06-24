"use client";

import { SafeCard } from "@/types";
import { Card } from "@prisma/client";
import Image from "next/image";

interface CardContentProps {
  card: SafeCard;
}

const CardContent: React.FC<CardContentProps> = ({ card }) => {
  return (
    <>
      <div className="flex items-center w-full gap-6">
        <div className="flex bg-cusGrayBg/30 border-[1px] border-cusBorder text-cusText px-3 py-2 text-xs rounded-2xl">
          <div>{card.startTime?.slice(0, 2)}</div>
          <div>:</div>
          <div>{card.startTime?.slice(2, 4)}</div>
          <div>-</div>
          <div>{card.endTime?.slice(0, 2)}</div>
          <div>:</div>
          <div>{card.endTime?.slice(2, 4)}</div>
        </div>
        <div className=" relative w-[100px] h-[100px]">
          <Image
            src={card.listing.images[0].url || "/imgplaceholder.png"}
            alt="List Item Image"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div>{card.listing.title}</div>
          <div className="text-cusText">{card.listing.description}</div>
        </div>
        <div className="cursor-pointer relative"></div>
      </div>
    </>
  );
};

export default CardContent;
