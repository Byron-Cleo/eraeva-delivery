"use server";

import { cookies } from "next/headers";
import {
  convertToPlainObject,
  formatError,
  round2,
  formatNumberWithDecimal,
} from "@/lib/utils";
import { CartItem } from "@/types";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

//calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    ),
    shippingPrice = round2(itemsPrice < 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: formatNumberWithDecimal(itemsPrice),
    shippingPrice: formatNumberWithDecimal(shippingPrice),
    taxPrice: formatNumberWithDecimal(taxPrice),
    totalPrice: formatNumberWithDecimal(totalPrice),
  };
};

export async function addItemToCart(data: { item: CartItem }) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    //Get session and user ID
    //a. getting session
    const session = await auth();
    //b. getting user id
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //get user cart from the database
    const cart = await getMyCart();

    //parse and validate added item
    const item = cartItemSchema.parse(data.item);

    //find the product from the database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");

    //creating new cart object
    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // Add the new cart to database
      await prisma.cart.create({ data: newCart });

      //Revalidate the product page: purpose to clear the cache for a particular path
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: "Item added to cart successfully",
      };
    } else {

    }
    
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  //1. check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  //2.Get session and user ID
  //a. getting session
  const session = await auth();
  //b. getting user id
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  //Get user cart from the database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });
  if (!cart) return undefined;

  //convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
