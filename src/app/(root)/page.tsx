import MenuList from "@/components/shared/menu/menu-list";
import {
  getLatestMenus,
  getFeaturedMenus,
} from "@/lib/actions/menu.actions";
import MenuCarousel from "@/components/shared/menu/menu-carousel";
import ViewAllMenusButton from "@/components/view-all-menus-button";
import IconBoxes from "@/components/icon-boxes";
import DealCountDown from "@/components/deal-countdown";
import sampleData from "@/db/sample-data";
import { Menu } from "@/types";

const Homepage = async () => {
  const latestProducts = await getLatestMenus();
  const featuredMenus = await getFeaturedMenus();

  return (
    <>
      {/* {featuredMenus.length > 0 && (
        <MenuCarousel data={featuredMenus} />
      )} */}
      <MenuList data={latestProducts} title="Our Popular Menu" limit={4} />
      {/* <ViewAllMenusButton />
      <DealCountDown />
      <IconBoxes /> */}
    </>
  );
};

export default Homepage;
