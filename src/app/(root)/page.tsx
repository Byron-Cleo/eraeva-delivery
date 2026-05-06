import ProductList from "@/components/shared/products/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/products/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";
import IconBoxes from "@/components/icon-boxes";
import DealCountDown from "@/components/deal-countdown";
import sampleData from "@/db/sample-data";
import { Product } from "@/types";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )} */}
      <ProductList data={latestProducts} title="Our Popular Menu" limit={4} />
      {/* <ViewAllProductsButton />
      <DealCountDown />
      <IconBoxes /> */}
    </>
  );
};

export default Homepage;
