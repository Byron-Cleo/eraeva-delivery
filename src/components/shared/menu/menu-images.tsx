"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MenuImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  const currentImage = images[current];
  const currentImageName = currentImage.split("/").pop(); // e.g. "beef-fry-rice.png"
  const currentAccompaniment = currentImageName
    ?.replace(".png", "")
    .split("-")
    .pop(); // e.g. "rice"

  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              current === index && "border-orange-600",
            )}
          >
            <Image src={image} alt="image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuImages;
