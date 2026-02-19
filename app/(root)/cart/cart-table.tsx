"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Cart } from "@/types";
import { Button } from "@/components/ui/button";

const CartTable = ({ cart }: { cart?: Cart }) => {
  //then initailze the imported packages for their functionlities
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go to shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5 overflow-x-auto">
          <div className="overflow-x-auto md: col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map(
                  (item) => (
                    console.log("cart item", item),
                    (
                      <TableRow key={item.slug}>
                        <TableCell>
                          <Link
                            href={`/product/${item.slug}`}
                            className="flex items-center gap-2"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="object-cover rounded"
                            />
                            <span className="px-2">{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell className="flex-center gap-2">
                          <Button
                            disabled={isPending}
                            variant="outline"
                            type="button"
                            onClick={() => {
                              startTransition(async () => {
                                const res = await removeItemFromCart(
                                  item.productId,
                                );
                                if (!res.success) {
                                  toast({
                                    variant: "destructive",
                                    description: res.message,
                                  });
                                }
                              });
                            }}
                          >
                            {isPending ? (
                              <Loader className="h-4 w-4" animate-spin />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                          </Button>
                          <span>{item.qty}</span>
                          <Button
                            disabled={isPending}
                            variant="outline"
                            type="button"
                            onClick={() => {
                              startTransition(async () => {
                                const res = await addItemToCart({ item });
                                if (!res.success) {
                                  toast({
                                    variant: "destructive",
                                    description: res.message,
                                  });
                                }
                              });
                            }}
                          >
                            {isPending ? (
                              <Loader className="h-4 w-4" animate-spin />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price}
                        </TableCell>
                      </TableRow>
                    )
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default CartTable;
