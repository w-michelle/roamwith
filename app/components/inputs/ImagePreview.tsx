"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface ImagePreviewProp {
  image: any;
  onClick: (name: string) => void;
}

const ImagePreview: React.FC<ImagePreviewProp> = ({ image, onClick }) => {
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    setPreview(URL.createObjectURL(image));
    return () => URL.revokeObjectURL(preview);
  }, []);

  return (
    <div className="group relative flex items-center justify-center border-[1px] rounded-lg hover:border-neutral-400 cursor-pointer">
      <div className="relative w-[200px] h-[120px]">
        {preview !== "" && (
          <Image
            fill
            alt="preview of uploaded image"
            src={preview}
            className="object-contain"
          />
        )}
      </div>
      <div className="hidden group-hover:flex items-center justify-center text-white absolute top-[-6px] right-[-6px] rounded-full h-5 w-5 bg-red-400 hover:bg-red-700">
        <IoMdClose onClick={() => onClick(image.name)} />
      </div>
    </div>
  );
};

export default ImagePreview;
