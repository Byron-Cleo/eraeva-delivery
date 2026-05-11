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
    <p className={cn("inline-flex items-start gap-1 whitespace-nowrap text-2xl", className)}>
      <span className="text-xs leading-none">KSh</span>
      <span className="leading-none">{intValue}</span>
      <span className="text-xs leading-none">.{floatvalue}</span>
    </p>
  );
};

export default MenuPrice;
