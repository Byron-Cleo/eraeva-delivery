"use client";
import { useMenuSelection } from "@/components/shared/menu/Context/MenuSelectionContext";

type Props = {
  menuName: string;
  starches: { id: string; name: string }[];
  defaultAccompanyId?: string;
};

const MenuSelectionSummary = ({
  menuName,
  starches,
  defaultAccompanyId,
}: Props) => {
  const { currentAccompaniment, selectedVegetableName } = useMenuSelection();

  // Derive full starch name from the current accompaniment keyword
  const activeStarch =
    starches.find((s) =>
      currentAccompaniment
        ? s.name.toLowerCase().includes(currentAccompaniment.toLowerCase())
        : s.id === defaultAccompanyId,
    )?.name ?? "—";

  const activeVegetable = selectedVegetableName ?? "—";

  return (
    <p className="text-2xl md:text-3xl font-bold text-center text-white">
      <span className="text-sm md:text-base font-semibold text-white/80">
        Your Order:{" "}
      </span>
      <span className="text-white drop-shadow">{menuName}</span>
      <span className="text-sm md:text-base font-semibold text-white/80">
        {" "}
        with{" "}
      </span>
      <span className="text-white drop-shadow">{activeStarch}</span>
      <span className="text-sm md:text-base font-semibold text-white/80">
        {" "}
        and{" "}
      </span>
      <span className="text-green-100 drop-shadow">{activeVegetable}</span>
    </p>
  );
};

export default MenuSelectionSummary;
