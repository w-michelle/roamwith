"use client";
import { Auth } from "@/app/(marketing)/_components/Auth";

import { useModal } from "@/app/hooks/useModal";
import Link from "next/link";

import { FaLongArrowAltRight } from "react-icons/fa";

export const Heading = ({ user }: any) => {
  const modal = useModal();

  return (
    <div className="max-w-3xl space-y-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold">
        Plan, Sort & Bookmark Your Next Trip.
      </h1>
      <h1 className="text-2xl font-bold">
        Welcome to <span>ROAM WITH_</span>
      </h1>

      {user?.email ? (
        <Link href={"/main"}>
          <div className="flex items-center justify-between w-[120px] gap-2 py-1 hover:text-cusGreen hover:bg-[#16461e] bg-[#16461e]/80 text-white pl-3 rounded-md hover:cursor-pointer">
            <div>Enter</div>
            <div className="bg-green-950 w-8 rounded-md p-1 mr-1">
              <FaLongArrowAltRight className=" size-5" />
            </div>
          </div>
        </Link>
      ) : (
        <div>
          <button
            className="flex items-center text-sm gap-2 bg-black hover:bg-black/80 text-white py-3 px-4 rounded-md hover:cursor-pointer"
            onClick={() => modal.onOpen("login")}
          >
            Get RoamWith Free
            <FaLongArrowAltRight />
          </button>
          <Auth />
        </div>
      )}
    </div>
  );
};
