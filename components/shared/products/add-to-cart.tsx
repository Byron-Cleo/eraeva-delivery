"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart } from "@/lib/actions/cart.actions";

import { CartItem } from "@/types";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    const res = await addItemToCart({ item });

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message,
      });
      return;
      // router.refresh();
    }
    //Handle success case of adding to cart
    toast({
      title: "Success",
      description: res.message,
      action: (
        <ToastAction
          className="text-white bg-primary hover:bg-gray-800"
          altText="Go to cart"
          onClick={() => router.push("/cart")}
        >
         Go To Cart
        </ToastAction>
      ),
    });
  };

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add to Cart
    </Button>
  );
};

export default AddToCart;
