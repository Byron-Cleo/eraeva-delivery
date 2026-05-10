import { cn } from "@/lib/utils";

const MenuPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  //unsure product price to 2 decimal places
  const stringValue = value.toFixed(2);

  //get the integer and float values
  const [intValue, floatvalue] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">KSh </span> {intValue}
      <span className="text-xs align-super">.{floatvalue}</span>
    </p>
  );
};

export default MenuPrice;
