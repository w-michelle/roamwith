"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { IoMdClose } from "react-icons/io";

import * as yup from "yup";
import Input from "../inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { categoryIcons } from "./CategoryModal";
import { useModal } from "@/app/hooks/useModal";

type FormData = {
  title: string;
  icon: string;
  catId?: string;
};

interface EditCatProp {
  currentTitle: string;
  currentIconName: string;
  categoryId: string;
}
const EditCategoryModal: React.FC<EditCatProp> = ({
  currentTitle,
  currentIconName,
  categoryId,
}) => {
  const modal = useModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const catIcons = categoryIcons;

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    icon: yup.string().required("Category is required"),
    catId: yup.string(),
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const icon = watch("icon");

  useEffect(() => {
    setValue("title", currentTitle);
    setValue("icon", currentIconName);
    setValue("catId", categoryId);
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/category/editCategory", data)
      .then(() => {
        toast.success("Category Updated!");
        modal.onClose();
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const colorOne = ["lime", "green", "mediumblue", "teal", "dimgray", "indigo"];
  const colorTwo = [
    "violet",
    "red",
    "orange",
    "yellow",
    "purple",
    "fuchsia",
    "pink",
  ];

  const [randomIndex, setRandomIndex] = useState(Math.floor(Math.random() * 7));

  const gradientColorOne = `${colorOne[randomIndex]}`;
  const gradientColorTwo = `${colorTwo[randomIndex]}`;
  const gradient = `custom ${gradientColorOne} ${gradientColorTwo}`;
  if (modal.openModal !== "editCategory") {
    return null;
  }
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="flex items-center justify-center fixed inset-0 bg-neutral-800/70 z-50"
    >
      <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto ">
        <div>
          <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
              <button
                onClick={modal.onClose}
                className="p-1 border-0 hover:opacity-70 transition absolute left-9"
              >
                <IoMdClose size={18} />
              </button>
              <div className="text-lg font-semibold">Edit category</div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-9"
            >
              <Input
                id="title"
                label="Title"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <div className="mt-9 grid place-items-center grid-cols-3 md:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto">
                <div className="col-span-1">
                  <div
                    onClick={() => setValue("icon", gradient)}
                    className={`${
                      icon.includes("custom")
                        ? "border-black border-2"
                        : "border-neutral-300 border-[1px]"
                    } rounded-xl flex items-center hover:border-black cursor-pointer p-3`}
                  >
                    <div
                      className={`w-7 h-7 bg-gradient-to-tl from-red-500 to-teal-700`}
                    ></div>
                  </div>
                </div>
                {catIcons.map((item, index) => (
                  <div
                    key={index}
                    className="col-span-1"
                  >
                    <div
                      onClick={() => setValue("icon", item.name)}
                      className={`${
                        icon === item.name
                          ? "border-black border-2"
                          : "border-neutral-300 border-[1px]"
                      } rounded-xl flex items-center hover:border-black cursor-pointer p-3`}
                    >
                      <item.icon size={30} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <input
                  type="submit"
                  value="Submit"
                  disabled={isLoading}
                  className="cursor-pointer relative py-3 text-white w-full rounded-lg border-2  hover:bg-cusGreen/80 bg-cusGreen disabled:bg-cusGreen/30 disabled:cursor-not-allowed"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
