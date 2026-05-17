import MenuCard from "./menu-card";
import { Menu } from "@/types";

const MenuList = ({
  data,
  title,
  limit,
}: {
  data: Menu[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {limitedData.map((product: Menu) => (
            <MenuCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>no menus yet</p>
        </div>
      )}
    </div>
  );
};

export default MenuList;
