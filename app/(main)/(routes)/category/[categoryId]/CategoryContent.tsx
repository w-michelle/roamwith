"use client";

import EmptyState from "@/app/components/EmptyState";
import { AllListings } from "@/app/components/listing/AllListings";

import { categoryIcons } from "@/app/components/modals/CategoryModal";
import EditCategoryModal from "@/app/components/modals/EditCategory";
import ListingModal from "@/app/components/modals/ListingModal";

import { useModal } from "@/app/hooks/useModal";
import { SafeCategory, SafeListing } from "@/types";
import { formatDate } from "@/utils/formatDate";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineModeEdit } from "react-icons/md";

interface CategoryClientProps {
  listings: SafeListing[];
  currentCategory: SafeCategory;
  categories?: SafeCategory[];
}

const CategoryContent: React.FC<CategoryClientProps> = ({
  listings,
  currentCategory,
  categories,
}) => {
  const modal = useModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const renderIcon = (name: string) => {
    const Icon = categoryIcons.find((icon) => icon.name === name);
    if (Icon) {
      return <Icon.icon size={30} />;
    } else {
      return null;
    }
  };
  const gradientIcon = (first: string, second: string) => {
    return `linear-gradient(to left top, ${first}, ${second})`;
  };
  const handleDeleteCategory = () => {
    setIsLoading(true);
    axios
      .delete("/api/category/editCategory", {
        data: { catId: currentCategory.id },
      })
      .then(() => {
        toast.success("Removed Category");

        router.push("/");
        router.refresh();
      })
      .catch((error: any) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!listings) {
    return null;
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-4 p-3">
      <div className="pb-4 w-full flex flex-col items-center justify-center gap-2 border-b-[1px] border-neutral-400">
        <p className="text-neutral-400/70 self-start text-sm">
          Created: {formatDate(currentCategory.createdAt)}
        </p>
        <div>
          {" "}
          {currentCategory.icon.includes("custom") ? (
            <div
              className={`w-7 h-7 `}
              style={{
                backgroundImage: `${gradientIcon(
                  currentCategory.icon.split(" ")[1],
                  currentCategory.icon.split(" ")[2]
                )}`,
              }}
            ></div>
          ) : (
            renderIcon(currentCategory.icon)
          )}
        </div>
        <h1>
          {currentCategory.title.charAt(0).toUpperCase() +
            currentCategory.title.slice(1)}
        </h1>
      </div>
      {/* listings */}
      <div className="">
        <button
          onClick={() => modal.onOpen("listing")}
          aria-label="Add new listing"
          className="my-6 hover:bg-neutral-400 hover:text-white hover:cursor-pointer w-[100px] h-[100px] border-2 border-neutral-200  rounded-xl shadow-md flex items-center justify-center"
        >
          <IoMdAdd size={28} />
        </button>
        {listings?.length === 0 && (
          <div>
            <EmptyState title="No listings yet" />
          </div>
        )}
        <AllListings listings={listings} />
      </div>
      <div className="flex flex-col gap-4 text-sm mt-8">
        <button
          onClick={() => modal.onOpen("editCategory")}
          className="py-2 w-[100px] bg-neutral-200 disabled:cursor-not-allowed hover:bg-neutral-400 flex justify-center rounded-lg gap-2 items-center"
          disabled={isLoading}
        >
          EDIT <MdOutlineModeEdit />
        </button>
        <button
          onClick={() => handleDeleteCategory()}
          className="py-2 w-[100px] disabled:cursor-not-allowed disabled:bg-red-400/20 bg-red-400/70 hover:bg-red-800 hover:text-red-400 flex justify-center rounded-lg gap-2 items-center"
          disabled={isLoading}
        >
          DELETE
          <FaRegTrashAlt />
        </button>
      </div>

      <EditCategoryModal
        currentTitle={currentCategory.title}
        currentIconName={currentCategory.icon}
        categoryId={currentCategory.id}
      />

      <ListingModal categories={categories} />
    </div>
  );
};

export default CategoryContent;
