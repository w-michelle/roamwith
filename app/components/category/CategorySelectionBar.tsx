import React from "react";

import { categoryIcons } from "../modals/CategoryModal";
import { SafeCategory } from "@/types";

import { IoIosAdd } from "react-icons/io";
import { useModal } from "@/app/hooks/useModal";

interface CategorySelectionBarProps {
  categories?: SafeCategory[];
  onClick: (value: string) => void;
  selected?: string;
}
const CategorySelectionBar: React.FC<CategorySelectionBarProps> = ({
  categories,
  onClick,
  selected,
}) => {
  const modal = useModal();

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
          className="cursor-pointer rounded-lg p-3 border-[2px] border-neutral-400 w-[50px] h-[50px] flex items-center justify-center"
        >
          <IoIosAdd size={25} />
        </button>
        {categories?.map((category) => (
          <div
            onClick={() => onClick(category.id)}
            key={category.id}
            className="text-center relative"
            aria-label={`Category: ${category.title}`}
          >
            <div
              className={`cursor-pointer rounded-lg p-3 border-[2px] ${
                selected == category.id
                  ? "border-cusGreen"
                  : "border-neutral-200"
              } w-[50px] h-[50px] flex items-center justify-center`}
            >
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelectionBar;
