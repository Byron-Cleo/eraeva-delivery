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
import { Prisma } from "@/db/generated/prisma/client";

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

    //find the menu from the database
    const menu = await prisma.menu.findFirst({
      where: { id: item.menuId },
    });
    if (!menu) throw new Error("Menu not found");

    //1. creating a cart is making it MUST HAVE A MENU AND USER hence called a cart
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

      //Revalidate the menu page: purpose to clear the cache for a particular path
      revalidatePath(`/menu/${menu.slug}`);

      return {
        success: true,
        message: `${menu.name} added to cart successfully`,
      };
    } else {
      //2. If there is a cart: Meaning there is a MENU AND ASSOCIATED USER
      //check the existing item is already in the cart
      const existItem = (cart.items as CartItem[]).find(
        (i) => i.menuId === item.menuId,
      );

      if (existItem) {
        //check stock
        if (menu.stock < existItem.qty + 1) {
          throw new Error("Menu is out of stock");
        }

        //increase the quantity
        (cart.items as CartItem[]).find(
          (i) => i.menuId === item.menuId,
        )!.qty = existItem.qty + 1;
      } else {
        //NEW MENU: meaning item menu does not exist IN THE CART
        if (menu.stock < 1) throw new Error("Not enough stock");

        //then add the menu into the cart to FINALLY EXIST IN THE CART
        (cart.items as CartItem[]).push(item);
      }

      //FINALY SAVE THE CART INTO THE DATABASE
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      //Revalidate the menu page: purpose to clear the cache for a particular path
      revalidatePath(`/menu/${menu.slug}`);

      return {
        success: true,
        message: `${menu.name} ${existItem ? "updated in" : "added to"} Cart Successfully.`,
      };
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

export async function removeItemFromCart(menuId: string) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    //Get the menu from the database
    const menu = await prisma.menu.findFirst({
      where: { id: menuId },
    });
    if (!menu) throw new Error("Menu not found");

    //Get user cart from the database
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    //Check for the existing item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.menuId === menuId,
    );

    if (!exist) throw new Error("Item not found in cart");

    //check cart item with 1 quantity
    if (exist.qty === 1) {
      //remove the item from the cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.menuId !== exist.menuId,
      );
    } else {
      //decrease the quantity by 1 since it is higher than 1
      (cart.items as CartItem[]).find(
        (x) => x.menuId === exist.menuId,
      )!.qty = exist.qty - 1;
    }

    //updae the cart in the database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    //Revalidate the menu page: purpose to clear the cache for a particular path
    revalidatePath(`/menu/${menu.slug}`);

    return {
      success: true,
      message: `${menu.name} was removed from cart successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
