import MenuList from "@/components/shared/menu/menu-list";
import {
  getLatestMenus,
  getFeaturedProducts,
} from "@/lib/actions/menu.actions";
import MenuCarousel from "@/components/shared/menu/menu-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";
import IconBoxes from "@/components/icon-boxes";
import DealCountDown from "@/components/deal-countdown";
import sampleData from "@/db/sample-data";
import { Menu } from "@/types";

const Homepage = async () => {
  const latestProducts = await getLatestMenus();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* {featuredProducts.length > 0 && (
        <MenuCarousel data={featuredProducts} />
      )} */}
      <MenuList data={latestProducts} title="Our Popular Menu" limit={4} />
      {/* <ViewAllProductsButton />
      <DealCountDown />
      <IconBoxes /> */}
    </>
  );
};

export default Homepage;
