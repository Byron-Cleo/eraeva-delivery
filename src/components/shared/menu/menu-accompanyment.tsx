"use client";
import { useEffect } from "react";
import { useMenuSelection } from "@/components/shared/menu/Context/MenuSelectionContext";
import MenuPrice from "@/components/shared/menu/menu-price";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AccompanimentItem = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: { toString(): string } | string | null;
  image: string | null;
  createdAt: Date;
};

type Props = {
  starches: AccompanimentItem[];
  vegetables: AccompanimentItem[];
  images: string[];
  defaultAccompanyId?: string;
  defaultVegetableId?: string;
};

/** Extracts the last word from a filename: "beef-fry-rice.png" -> "rice" */
const getKeyword = (imageSrc: string) =>
  imageSrc.split("/").pop()?.replace(".png", "").split("-").pop() ?? "";

const MenuAccompanyment = ({
  starches,
  vegetables,
  images,
  defaultAccompanyId,
  defaultVegetableId,
}: Props) => {
  const {
    currentAccompaniment,
    setCurrentAccompaniment,
    setCurrentIndex,
    selectedVegetableName,
    setSelectedVegetableName,
  } = useMenuSelection();

  const defaultVegetableName = vegetables.find(
    (v) => v.id === defaultVegetableId,
  )?.name;

  // Reset vegetable to default whenever the starch/image changes
  useEffect(() => {
    setSelectedVegetableName(defaultVegetableName);
  }, [currentAccompaniment]);

  if (!starches.length && !vegetables.length) return null;

  /** When a starch radio is selected, find the matching image and switch to it */
  const handleStarchSelect = (starchName: string) => {
    const keyword = starchName.toLowerCase().split(" ")[0];
    const matchIndex = images.findIndex((img) =>
      getKeyword(img).toLowerCase().includes(keyword),
    );
    if (matchIndex !== -1) {
      setCurrentIndex(matchIndex);
      setCurrentAccompaniment(getKeyword(images[matchIndex]));
    } else {
      setCurrentAccompaniment(keyword);
    }
  };

  /** Determine which starch radio should appear checked */
  const activeStarchName = starches.find((s) =>
    currentAccompaniment
      ? s.name.toLowerCase().includes(currentAccompaniment.toLowerCase())
      : s.id === defaultAccompanyId,
  )?.name;

  /** When a vegetable radio is selected, update only the vegetable state */
  const handleVegetableSelect = (vegetableName: string) => {
    setSelectedVegetableName(vegetableName);
  };

  const activeVegetableName = vegetables.find(
    (v) => v.name === selectedVegetableName,
  )?.name;

  return (
    <div className="mt-10">
      <p className="font-semibold mb-3">Served With</p>
      <div className="flex flex-col gap-6">
        {/* Starch */}
        {starches.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Starch
            </p>
            <RadioGroup
              value={activeStarchName ?? ""}
              onValueChange={handleStarchSelect}
              className="flex flex-col gap-2"
            >
              {starches.map((item) => {
                const active = activeStarchName === item.name;
                return (
                  <Label
                    key={item.id}
                    htmlFor={`starch-${item.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                      active
                        ? "border-orange-600 bg-orange-50"
                        : "hover:border-orange-300",
                    )}
                  >
                    <RadioGroupItem
                      id={`starch-${item.id}`}
                      value={item.name}
                      className="text-orange-600 border-orange-400"
                    />
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>
        )}

        {/* Vegetables */}
        {vegetables.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Vegetable
            </p>
            <RadioGroup
              value={activeVegetableName ?? ""}
              onValueChange={handleVegetableSelect}
              className="flex flex-col gap-2"
            >
              {vegetables.map((item) => {
                const active = activeVegetableName === item.name;
                return (
                  <Label
                    key={item.id}
                    htmlFor={`vegetable-${item.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                      active
                        ? "border-orange-600 bg-orange-50"
                        : "hover:border-orange-300",
                    )}
                  >
                    <RadioGroupItem
                      id={`vegetable-${item.id}`}
                      value={item.name}
                      className="text-orange-600 border-orange-400"
                    />
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.price && (
                      <MenuPrice
                        value={Number(item.price.toString())}
                        className="text-sm"
                      />
                    )}
                  </Label>
                );
              })}
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuAccompanyment;
