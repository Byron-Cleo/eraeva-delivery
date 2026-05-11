import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import MenuPrice from "@/components/shared/menu/menu-price";
import {
  getMenuBySlug,
  getAllAccompaniments,
} from "@/lib/actions/menu.actions";
import MenuImages from "@/components/shared/menu/menu-images";
// import AddToCart from "@/components/shared/menu/add-to-cart";
// import { getMyCart } from "@/lib/actions/cart.actions";
// import ReviewList from "./review-list";
// import { auth } from "@/auth";
import Rating from "@/components/shared/menu/rating";
import { MenuSelectionProvider } from "@/components/shared/menu/Context/MenuSelectionContext";
import MenuAccompanyment from "@/components/shared/menu/menu-accompanyment";
import MenuSelectionSummary from "@/components/shared/menu/menu-selection-summary";
import MenuLiveTotal from "../../../../components/shared/menu/menu-live-total";
import MenuOrderDialog from "@/components/shared/menu/menu-order-dialog";

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const menu = await getMenuBySlug(slug);
  if (!menu) notFound();

  // Cart/session logic is intentionally disabled on the hosted menu details page.
  // const session = await auth();
  // const userId = session?.user?.id;
  // const cart = await getMyCart();

  const allAccompaniments = await getAllAccompaniments();
  const starches = allAccompaniments.filter((a) => a.category === "starch");
  const vegetables = allAccompaniments.filter(
    (a) => a.category === "vegetable",
  );
  return (
    <MenuSelectionProvider>
      <section>
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 shadow-md">
          <MenuSelectionSummary
            menuName={menu.name}
            starches={starches}
            defaultAccompanyId={menu.accompanyId ?? undefined}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images column */}
          <div className="col-span-2">
            {" "}
            <MenuImages images={menu.images} />
          </div>
          <div className="col-span-2 p-5">
            {/* Details column */}
            <div className="flex flex-col gap-6">
              <p>
                {menu.brand} {menu.category}
              </p>
              <h1 className="h3-bold">{menu.name}</h1>
              <Rating value={Number(menu.rating)} />
              <p>{menu.numReviews} Review(s)</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <MenuPrice
                  value={Number(menu.price)}
                  className="w-24 px-5 py-2 text-green-700 bg-green-100 rounded-full"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{menu.description}</p>
            </div>
            <MenuAccompanyment
              starches={starches}
              vegetables={vegetables}
              images={menu.images}
              defaultAccompanyId={menu.accompanyId ?? undefined}
              defaultVegetableId={menu.vegetableId ?? undefined}
            />
          </div>
          {/* Action column */}
          <div>
            <Card>
              <CardContent className="p-4">
                <MenuLiveTotal
                  basePrice={Number(menu.price)}
                  vegetables={vegetables}
                  defaultVegetableId={menu.vegetableId ?? undefined}
                />
                <div className="flex justify-between mb-2">
                  <div>Status</div>
                  {menu.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out Stock</Badge>
                  )}
                </div>
                {menu.stock > 0 && (
                  <div className="flex-center">
                    <MenuOrderDialog
                      menuName={menu.name}
                      menuDescription={menu.description}
                      image={menu.images?.[0]}
                      basePrice={Number(menu.price)}
                      mealPeriod={menu.mealTypes?.[0]?.mealType.name}
                      starches={starches}
                      vegetables={vegetables}
                      defaultAccompanyId={menu.accompanyId ?? undefined}
                      defaultVegetableId={menu.vegetableId ?? undefined}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* <section className="mt-10">
        <h2 className="h2-bold">Customer Reviews</h2>
        <ReviewList
          userId={userId || ""}
          menuId={product.id}
          productSlug={product.slug}
        />
      </section> */}
    </MenuSelectionProvider>
  );
};

export default ProductDetailsPage;
