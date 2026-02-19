"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Minus, Plus, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";

import { CartItem, Cart } from "@/types";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();

  // initializing useTransition hook for dispalying asyn actions
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = (await addItemToCart({ item })) || undefined;

      if (!res?.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: res?.message || "Failed to add item to cart",
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
    });
  };

  // handle remove from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = (await removeItemFromCart(item.productId)) || undefined;

      //Handle success case of removing from cart
      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
    });
  };

  //check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add to Cart
    </Button>
  );
};

export default AddToCart;
