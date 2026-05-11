"use client";

import MenuPrice from "@/components/shared/menu/menu-price";
import { useMenuSelection } from "@/components/shared/menu/Context/MenuSelectionContext";
import { cn } from "@/lib/utils";

type VegetableOption = {
  id: string;
  name: string;
  price: string | null;
};

type Props = {
  basePrice: number;
  vegetables: VegetableOption[];
  defaultVegetableId?: string;
};

const MenuLiveTotal = ({
  basePrice,
  vegetables,
  defaultVegetableId,
}: Props) => {
  const { selectedVegetableName } = useMenuSelection();

  const activeVegetable =
    vegetables.find((vegetable) => vegetable.name === selectedVegetableName) ??
    vegetables.find((vegetable) => vegetable.id === defaultVegetableId);

  const addOnPrice = Number(activeVegetable?.price ?? "0");
  const totalPrice = basePrice + addOnPrice;
  const selectedVegetableStyling =
    activeVegetable &&
    "inline-flex items-center justify-center text-center rounded-full border border-green-300 bg-green-100 px-2.5 py-1 font-medium text-green-700";

  return (
    <div className="mb-3 space-y-3">
      <div className="flex justify-between gap-3 items-start">
        <div>Food Price</div>
        <div className="text-right">
          <MenuPrice value={basePrice} />
        </div>
      </div>

      <div className="flex justify-between gap-3 items-start">
        <div>
          <p
            className={cn(
              "text-xs text-muted-foreground",
              selectedVegetableStyling,
            )}
          >
            {addOnPrice > 0
              ? activeVegetable?.name
              : `${activeVegetable?.name ?? "No add-on selected"} (Free)`}
          </p>
        </div>
        <div className="text-right">
          {addOnPrice > 0 ? (
            <MenuPrice
              value={addOnPrice}
              className="rounded-full border border-green-300 bg-green-100 px-3 py-2 text-green-700"
            />
          ) : (
            <p
              className={cn(
                "text-xs text-muted-foreground",
                selectedVegetableStyling,
              )}
            >
              No extra charge
            </p>
          )}
        </div>
      </div>

      <div className="border-t pt-3 flex justify-between gap-3 items-start">
        <div>
          <div className="font-medium">Total</div>
          <p className="text-xs text-muted-foreground">
            Base price + selected add-on
          </p>
        </div>
        <div className="text-right">
          <MenuPrice value={totalPrice} className="font-semibold" />
        </div>
      </div>
    </div>
  );
};

export default MenuLiveTotal;
