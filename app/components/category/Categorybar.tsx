import React from "react";

import getCategory from "../../actions/getCategory";

import { SafeUser } from "@/types";
import { CategoryClient } from "./CategoryClient";

interface CategorybarProps {
  currentUser?: SafeUser | null;
}

const Categorybar: React.FC<CategorybarProps> = async ({ currentUser }) => {
  if (!currentUser) {
    return;
  }

  const categories = await getCategory(currentUser?.id);

  return (
    <div className="px-3 pb-3 pt-5 border-b-[1px]">
      <div>
        <CategoryClient categories={categories} />
      </div>
    </div>
  );
};

export default Categorybar;
