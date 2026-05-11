"use client";
import { useEffect } from "react";
import { useMenuSelection } from "@/components/shared/menu/Context/MenuSelectionContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AccompanimentItem = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: { toString(): string } | string | null;
  image: string | null;
  isDefault: boolean;
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

  // On mount: initialize the image and starch radio to match defaultAccompanyId.
  // This makes every menu show the correct default starch/image on first load,
  // regardless of image array order.
  useEffect(() => {
    const defaultStarch = starches.find((s) => s.id === defaultAccompanyId);
    if (defaultStarch) {
      const keyword = defaultStarch.name.toLowerCase().split(" ")[0];
      const matchIndex = images.findIndex((img) =>
        getKeyword(img).toLowerCase().includes(keyword),
      );
      if (matchIndex !== -1) {
        setCurrentIndex(matchIndex);
        setCurrentAccompaniment(getKeyword(images[matchIndex]));
      } else {
        setCurrentAccompaniment(keyword);
      }
    } else {
      // Fallback: no defaultAccompanyId set — derive from the first image
      setCurrentAccompaniment(getKeyword(images[0]));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize the vegetable once from the database default, but do not
  // overwrite the user's in-page selection when starch/image changes.
  useEffect(() => {
    if (!selectedVegetableName) {
      setSelectedVegetableName(defaultVegetableName);
    }
  }, [defaultVegetableName, selectedVegetableName, setSelectedVegetableName]);

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

  // Split vegetables into free (isDefault=true) and premium (isDefault=false)
  const includedVegetables = vegetables.filter((v) => v.isDefault);
  const premiumVegetables = vegetables.filter((v) => !v.isDefault);

  const renderVegetableCard = (item: AccompanimentItem) => {
    const active = activeVegetableName === item.name;
    return (
      <Label
        key={item.id}
        htmlFor={`vegetable-${item.id}`}
        className={cn(
          "inline-flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
          !item.isDefault && "sm:max-w-[calc(50%-0.25rem)]",
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
        <div className="min-w-0 flex-1">
          <p className="font-medium">{item.name}</p>
          {item.isDefault ? (
            <Badge className="mt-1 text-xs bg-green-100 text-green-700 border border-green-300 hover:bg-green-100">
              Free Slice
            </Badge>
          ) : (
            <Badge className="mt-1 text-xs whitespace-normal leading-tight bg-red-100 text-red-600 border border-red-300 hover:bg-red-100">
              Extra Charge +KSh {Number(item.price?.toString() ?? "0").toFixed(0)}
            </Badge>
          )}
        </div>
      </Label>
    );
  };

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
              className="flex flex-row flex-wrap gap-2"
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
                    <div className="flex flex-col items-center gap-2">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded object-cover"
                        />
                      )}
                      <p className="text-center text-sm font-medium leading-tight">
                        {item.name}
                      </p>
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>
        )}

        {/* Vegetables — shared RadioGroup so only one can be active at a time */}
        {vegetables.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Vegetable
            </p>
            <RadioGroup
              value={activeVegetableName ?? ""}
              onValueChange={handleVegetableSelect}
              className="flex flex-col gap-4"
            >
              {/* Included (free) vegetables */}
              {includedVegetables.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Free
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {includedVegetables.map(renderVegetableCard)}
                  </div>
                </div>
              )}

              {/* Premium vegetables */}
              {premiumVegetables.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Premium
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {premiumVegetables.map(renderVegetableCard)}
                  </div>
                </div>
              )}
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuAccompanyment;
