"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMenuSelection } from "@/components/shared/menu/Context/MenuSelectionContext";

const getAccompaniment = (imageSrc: string) =>
  imageSrc.split("/").pop()?.replace(".png", "").split("-").pop();

const MenuImages = ({ images }: { images: string[] }) => {
  const { currentIndex, setCurrentIndex, setCurrentAccompaniment } =
    useMenuSelection();

  // Initialization is handled by MenuAccompanyment which knows the defaultAccompanyId.

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
    setCurrentAccompaniment(getAccompaniment(images[index]));
  };

  return (
    <div className="space-y-4">
      <Image
        src={images[currentIndex]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => handleSelect(index)}
            className={cn(
              "mr-2 cursor-pointer overflow-hidden rounded-lg border transition-colors hover:border-orange-600",
              currentIndex === index && "rounded-lg border-orange-600",
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
