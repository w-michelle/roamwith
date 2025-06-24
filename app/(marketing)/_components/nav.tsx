"use client";
import React from "react";

import { SafeUser } from "@/types";
import Logo from "@/app/components/navbar/Logo";
import UserMenu from "@/app/components/navbar/UserMenu";

import { useModal } from "@/app/hooks/useModal";

interface NavProps {
  currentUser: SafeUser | null;
}

const Nav: React.FC<NavProps> = async ({ currentUser }) => {
  const modal = useModal();

  return (
    <div className="flex justify-between items-center py-2 px-6 ">
      <Logo />

      <div className="flex items-end gap-4">
        {!currentUser ? (
          <div>
            <button
              className="flex text-sm items-center gap-2 bg-black text-white hover:bg-black/80 py-3 px-4 rounded-md hover:cursor-pointer"
              onClick={() => modal.onOpen("login")}
            >
              Get RoamWith Free
            </button>
          </div>
        ) : (
          <UserMenu currentUser={currentUser} />
        )}
      </div>
    </div>
  );
};

export default Nav;
