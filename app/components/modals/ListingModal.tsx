"use client";

import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import ListingContent from "../inputs/ListingContent";

import { SafeCategory } from "@/types";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../inputs/Input";

import ImagePreview from "../inputs/ImagePreview";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import CategorySelectionBar from "../category/CategorySelectionBar";
import { useModal } from "@/app/hooks/useModal";
enum STEPS {
  CATEGORY = 0,
  DESCRIPTION = 1,
  IMAGES = 2,
}
type FormData = {
  categoryId?: string;

  title: string;
  description?: string;
  images?: any;
};
interface ListingModalProps {
  categories?: SafeCategory[];
}
const ListingModal: React.FC<ListingModalProps> = ({ categories }) => {
  const router = useRouter();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [images, setImages] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);

  const modal = useModal();

  const schema = yup.object().shape({
    categoryId: yup.string(),
    title: yup.string().required("Title is required"),
    description: yup.string(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const selectedId = watch("categoryId");

  const handleChange = (e: any) => {
    setImages([...e.target.files]);
    setCustomValue("images", [...e.target.files]);
  };

  const removePreviewImage = (imgname: string) => {
    const newList = images.filter((item: any) => item.name !== imgname);
    setImages(newList);

    setCustomValue("images", newList);
  };

  const setCustomValue = (id: any, value: any) => {
    setValue(id, value);
  };

  const nextStep = () => {
    setStep((value) => value + 1);
  };

  const backStep = () => {
    setStep((value) => value - 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (formValues) => {
    setIsLoading(true);

    const data = new FormData();

    if (formValues.images.length > 0) {
      formValues.images.forEach((file: any) => {
        data.append("images", file);
      });
    }

    data.append("categoryId", formValues.categoryId);
    data.append("title", formValues.title);
    data.append("description", formValues.description);

    axios
      .post("/api/listings/createListing", data)
      .then((result) => {
        toast.success("New Item Created!");

        reset();
        setStep(STEPS.CATEGORY);
        setImages("");
        modal.onClose();
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  let bodyContent = (
    <div>
      <CategorySelectionBar
        onClick={(catId) => setCustomValue("categoryId", catId)}
        selected={selectedId}
        categories={categories}
      />
    </div>
  );
  let headerContent = (
    <div className="text-lg font-semibold">Choose a category</div>
  );

  if (step === STEPS.DESCRIPTION) {
    headerContent = <div className="text-lg font-semibold">Details</div>;
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Input
          register={register}
          errors={errors}
          id="title"
          label="Title"
        />
        <Input
          register={register}
          errors={errors}
          id="description"
          label="Description"
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    headerContent = <div className="text-lg font-semibold">Add Images</div>;
    bodyContent = (
      <div className="py-3">
        {images?.length > 0 ? (
          <div>
            <p className="text-neutral-600 text-center mb-4">Preview</p>
            <div className="p-3 grid grid-cols-4 gap-4  max-h-[450px] overflow-y-auto">
              {images?.map((file: any, index: any) => (
                <div key={index}>
                  <ImagePreview
                    image={file}
                    onClick={(name: string) => removePreviewImage(name)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <label
            htmlFor="images"
            className=" cursor-pointer border-dashed border-2 border-neutral-300 p-20 flex flex-col justify-center items-center"
          >
            <p className="text-center bg-cusGreen hover:bg-cusGreen/30 hover:border-[1px] hover:border-cusGreen hover:text-cusGreen w-[200px] p-2 mt-2 text-white rounded-md">
              Browse Files
            </p>

            <input
              type="file"
              {...register("images")}
              id="images"
              name="images"
              accept="image/png, image/jpeg, image.jpg"
              className="hidden"
              multiple
              onChange={handleChange}
            />
          </label>
        )}
      </div>
    );
  }
  if (modal.openModal !== "listing") {
    return null;
  }
  return (
    <div className="flex items-center justify-center fixed inset-0 bg-neutral-800/70 z-10">
      <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto">
        <div>
          <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
              <button
                onClick={modal.onClose}
                className="p-1 border-0 hover:opacity-70 transition absolute left-9"
              >
                <IoMdClose size={18} />
              </button>
              {headerContent}
            </div>
            {/* body */}
            <div className="p-9">
              <ListingContent bodyContent={bodyContent} />
            </div>
            {/* buttons */}
            <div className="p-9 flex items-center justify-between gap-10">
              {step !== STEPS.CATEGORY && (
                <button
                  onClick={backStep}
                  disabled={isLoading}
                  className="py-3 w-full  hover:bg-cusGreen/80 disabled:cursor-not-allowed bg-cusGreen disabled:bg-cusGreen/30 text-white rounded-md"
                >
                  BACK
                </button>
              )}
              {step === STEPS.IMAGES ? (
                <button
                  onClick={handleSubmit(onSubmit)}
                  className="py-3 w-full  hover:bg-cusGreen/80 disabled:cursor-not-allowed bg-cusGreen disabled:bg-cusGreen/30 text-white rounded-md"
                  disabled={isLoading}
                >
                  SUBMIT
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={isLoading}
                  className="py-3 w-full  hover:bg-cusGreen/80 disabled:cursor-not-allowed bg-cusGreen disabled:bg-cusGreen/30 text-white rounded-md"
                >
                  NEXT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
