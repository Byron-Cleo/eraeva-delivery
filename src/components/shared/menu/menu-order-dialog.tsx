"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import MenuPrice from "@/components/shared/menu/menu-price";
import { useMenuSelection } from "@/components/shared/menu/Context/MenuSelectionContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type StarchOption = {
  id: string;
  name: string;
};

type VegetableOption = {
  id: string;
  name: string;
  price: string | null;
};

type Props = {
  menuName: string;
  menuDescription?: string;
  image?: string;
  basePrice: number;
  mealPeriod?: string;
  starches: StarchOption[];
  vegetables: VegetableOption[];
  defaultAccompanyId?: string;
  defaultVegetableId?: string;
};

const MenuOrderDialog = ({
  menuName,
  menuDescription,
  image,
  basePrice,
  mealPeriod,
  starches,
  vegetables,
  defaultAccompanyId,
  defaultVegetableId,
}: Props) => {
  const { currentAccompaniment, selectedVegetableName } = useMenuSelection();
  const [quantity, setQuantity] = useState(1);

  const activeStarch =
    starches.find((starch) =>
      currentAccompaniment
        ? starch.name.toLowerCase().includes(currentAccompaniment.toLowerCase())
        : starch.id === defaultAccompanyId,
    )?.name ?? "Not selected";

  const activeVegetable =
    vegetables.find((vegetable) => vegetable.name === selectedVegetableName) ??
    vegetables.find((vegetable) => vegetable.id === defaultVegetableId);

  const addOnPrice = Number(activeVegetable?.price ?? "0");
  const mealLineTotal = basePrice * quantity;
  const vegetableLineTotal = addOnPrice * quantity;
  const totalPrice = mealLineTotal + vegetableLineTotal;
  const mealPeriodLabel = mealPeriod
    ? mealPeriod.charAt(0) + mealPeriod.slice(1).toLowerCase()
    : "Meal";

  const getMealEmoji = () => {
    const normalizedName = menuName.toLowerCase();

    if (normalizedName.includes("chicken")) return "🍗";
    if (normalizedName.includes("beef")) return "🥩";
    if (normalizedName.includes("fish")) return "🐟";
    if (normalizedName.includes("rice")) return "🍚";
    if (normalizedName.includes("bread")) return "🍞";
    if (mealPeriodLabel === "Breakfast") return "🍳";
    if (mealPeriodLabel === "Dessert") return "🍰";
    if (mealPeriodLabel === "Beverage") return "🥤";

    return "🍽️";
  };

  const vegetableEmoji = addOnPrice > 0 ? "🥬" : "🥗";
  const formatCompactPrice = (value: number) => value.toFixed(0);
  const currentDateTime = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-full bg-orange-500 text-white hover:bg-orange-600"
        >
          <ShoppingCart className="h-4 w-4" />
          Add To Cart
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span>My</span>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
              {mealPeriodLabel}
            </span>
            <span>Order</span>
          </DialogTitle>
          <p className="text-center text-xs font-medium tracking-[0.14em] text-muted-foreground">
            {currentDateTime}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-dashed pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Order Preview
                </p>
                <p className="text-lg font-semibold">{menuName}</p>
              </div>
              <div className="flex min-w-[210px] flex-col items-center justify-center rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-3 text-center shadow-[0_12px_30px_rgba(251,146,60,0.18)]">
                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">
                  Ordering {quantity} {quantity === 1 ? "Plate" : "Plates"}
                </p>
                <div className="flex items-center justify-center gap-2.5">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200 bg-gradient-to-br from-white via-orange-50 to-amber-100 text-orange-900 shadow-sm transition-all hover:border-orange-300 hover:from-orange-50 hover:to-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    disabled={quantity === 1}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-6 text-center text-3xl font-medium leading-none text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-300 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white shadow-sm transition-all hover:from-orange-600 hover:via-orange-500 hover:to-amber-500"
                    onClick={() => setQuantity((current) => current + 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl shadow-sm">
                  {getMealEmoji()}
                </div>
                <div className="min-w-0 pr-2">
                  <p className="font-semibold leading-tight text-slate-900">
                    {menuName}
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                      @ KSh {formatCompactPrice(basePrice)} x {quantity}
                    </span>
                  </p>
                  {activeVegetable?.name ? (
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-sm leading-snug text-muted-foreground">
                      <span>Served with</span>
                      <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                        {activeStarch}
                      </span>
                      <span>and</span>
                      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        {activeVegetable.name}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">
                      {menuDescription ?? `${mealPeriodLabel} special`}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="inline-flex items-center gap-1 text-base font-semibold leading-tight text-slate-900">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      KSh
                    </span>
                    {formatCompactPrice(mealLineTotal)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3 border-t border-dashed pt-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl shadow-sm">
                  {vegetableEmoji}
                </div>
                <div className="min-w-0 pr-2">
                  <p className="font-semibold leading-tight text-slate-900">
                    {activeVegetable?.name ?? "Selected vegetable"}
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                      {addOnPrice > 0
                        ? `@ KSh ${formatCompactPrice(addOnPrice)} x ${quantity}`
                        : `x ${quantity}`}
                    </span>
                  </p>
                  {addOnPrice > 0 ? (
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">
                      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        Charged Vegetable
                      </span>
                    </p>
                  ) : null}
                </div>
                <div className="text-right">
                  {addOnPrice > 0 ? (
                    <p className="inline-flex items-center gap-1 text-base font-semibold leading-tight text-slate-900">
                      <span className="text-xs font-semibold uppercase text-muted-foreground">
                        KSh
                      </span>
                      {formatCompactPrice(vegetableLineTotal)}
                    </p>
                  ) : (
                    <p className="text-base font-semibold leading-tight text-slate-900">
                      Free
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-muted/20 p-4">
            <div className="mb-3 border-b border-dashed pb-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {mealPeriodLabel} Order
              </p>
              <p className="mt-1 leading-relaxed text-slate-900">
                <span className="text-sm font-medium text-muted-foreground">
                  {quantity} {quantity === 1 ? "Plate" : "Plates"} of
                </span>{" "}
                <span className="text-lg font-semibold">{menuName}</span>{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  with
                </span>{" "}
                <span className="text-lg font-semibold">{activeStarch}</span>{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  and
                </span>{" "}
                <span className="text-lg font-semibold">
                  {activeVegetable?.name ?? "selected vegetable"}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  .
                </span>
              </p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-lg font-bold text-slate-900">
                Grand Total
              </span>
              <div className="text-right">
                <p className="inline-flex items-center gap-1 text-lg font-semibold text-slate-900">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    KSh
                  </span>
                  {formatCompactPrice(totalPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="w-full sm:justify-between sm:space-x-0">
          <Button
            asChild
            className="w-full border border-orange-300 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-white shadow-sm hover:from-orange-600 hover:via-orange-500 hover:to-amber-500 sm:w-auto"
          >
            <Link href="/search">
              <ArrowLeft className="h-4 w-4" />
              Order Another Food
              <UtensilsCrossed className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/shipping-address">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MenuOrderDialog;
