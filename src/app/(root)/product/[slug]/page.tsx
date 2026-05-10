import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/menu/product-price";
import { getProductBySlug } from "@/lib/actions/product.actions";
import ProductImages from "@/components/shared/menu/product-images";
import AddToCart from "@/components/shared/menu/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/shared/menu/rating";

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  console.log("========>>>>", product);
  if (!product) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const cart = await getMyCart();
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images column */}
          <div className="col-span-2">
            {" "}
            <ProductImages images={product.images} />
          </div>
          <div className="col-span-2 p-5">
            {/* Details column */}
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <Rating value={Number(product.rating)} />
              <p>{product.numReviews} Review(s)</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 px-5 py-2 text-green-700 bg-green-100 rounded-full"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
            {(product.accompany || product.vegetable) && (
              <div className="mt-10">
                <p className="font-semibold mb-3">Served With</p>
                <div className="flex flex-col gap-3">
                  {product.accompany && (
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      {product.accompany.image && (
                        <img
                          src={product.accompany.image}
                          alt={product.accompany.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{product.accompany.name}</p>
                        {product.accompany.description && (
                          <p className="text-sm text-muted-foreground">
                            {product.accompany.description}
                          </p>
                        )}
                      </div>
                      {product.accompany.price && (
                        <ProductPrice
                          value={Number(product.accompany.price)}
                          className="text-sm"
                        />
                      )}
                    </div>
                  )}
                  {product.vegetable && (
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      {product.vegetable.image && (
                        <img
                          src={product.vegetable.image}
                          alt={product.vegetable.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{product.vegetable.name}</p>
                        {product.vegetable.description && (
                          <p className="text-sm text-muted-foreground">
                            {product.vegetable.description}
                          </p>
                        )}
                      </div>
                      {product.vegetable.price && (
                        <ProductPrice
                          value={Number(product.vegetable.price)}
                          className="text-sm"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Action column */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images![0],
                      }}
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
    </>
  );
};

export default ProductDetailsPage;
