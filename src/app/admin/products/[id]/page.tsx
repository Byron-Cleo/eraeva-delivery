import notFound from "@/app/not-found";
import UpdateProductForm from "@/components/admin/update-product-form";
import { getMenuById } from "@/lib/actions/menu.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Product",
  description: "Admin update product page",
};

const AdminProductUpdatePage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;

  const product = await getMenuById(id);

  if (!product) return notFound();

  return (
    <div className="space-y-8 max-w-5xl max-auto">
      <h1 className="h2-bold">Update Product</h1>
      <UpdateProductForm product={product} productId={product.id} />
      {/* <UpdateProductForm type="Update" product={product} productId={product.id} /> */}
    </div>
  );
};

export default AdminProductUpdatePage;
