"use client";

import { SafeCategory } from "@/types";
import React, { Suspense } from "react";
import { IoIosAdd } from "react-icons/io";
import CategoryModal, { categoryIcons } from "../modals/CategoryModal";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/hooks/useModal";
import Link from "next/link";

interface CategoryClientProps {
  categories?: SafeCategory[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
  categories,
}) => {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryClientSuspense categories={categories} />
    </Suspense>
  );
};

const CategorySkeleton = () => {
  const categoryBlock = Array.from({ length: 10 });

  return (
    <div>
      <div className="flex gap-4 overflow-x-auto">
        <div className="flex gap-4">
          {categoryBlock?.map((_, index) => (
            <div
              key={index}
              className="text-center relative"
            >
              <div className="rounded-lg p-3 w-[50px] h-[50px] flex items-center justify-center bg-neutral-300 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryClientSuspense: React.FC<CategoryClientProps> = ({
  categories,
}) => {
  const modal = useModal();
  const router = useRouter();
  const renderIcon = (iconName: string) => {
    const Icon = categoryIcons.find((item) => item.name === iconName);
    if (Icon) {
      return <Icon.icon size={25} />;
    } else {
      return null;
    }
  };

  const gradientIcon = (first: string, second: string) => {
    return `linear-gradient(to left top, ${first}, ${second})`;
  };

  return (
    <div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        <button
          onClick={() => modal.onOpen("category")}
          aria-label="Add new category"
          className="cursor-pointer rounded-lg p-3 border-[1px] border-black w-[50px] h-[50px] flex items-center justify-center"
        >
          <IoIosAdd size={25} />
        </button>
        <div className="flex gap-4">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="text-center relative"
              aria-label={`Category: ${category.title}`}
            >
              <div className="cursor-pointer rounded-lg p-3 border-[1px] border-black w-[50px] h-[50px] flex items-center justify-center">
                {category.icon.includes("custom") ? (
                  <div
                    className={`w-7 h-6 `}
                    style={{
                      backgroundImage: `${gradientIcon(
                        category.icon.split(" ")[1],
                        category.icon.split(" ")[2]
                      )}`,
                    }}
                  ></div>
                ) : (
                  renderIcon(category.icon)
                )}
              </div>
              <div className="text-sm w-[50px] truncate">{category.title}</div>
            </Link>
          ))}
        </div>
      </div>
      {modal.openModal === "category" && <CategoryModal />}
    </div>
  );
};
