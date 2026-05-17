import CreateProductForm from "@/components/admin/create-product-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Create Menu Page",
};

const CreateProductPage = () => {
  return (
    <>
      <h2 className="h2-bold">Create Menu</h2>
      <div className="my-8">
        <CreateProductForm />
        {/* <CreateProductForm type="Create" /> */}
      </div>
    </>
  );
};

export default CreateProductPage;
