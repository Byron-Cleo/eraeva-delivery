"use server";

import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import z from "zod";
import { Prisma } from "@prisma/client";

//get latest products
export async function getLatestMenus() {
  const data = await prisma.menu.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

//get single product by its slug
export async function getMenuBySlug(slug: string) {
  return await prisma.menu.findFirst({
    where: { slug: slug },
    include: {
      accompany: true,
      vegetable: true,
    },
  });
}

//get single product by its ID
export async function getMenuById(productId: string) {
  const data = await prisma.menu.findFirst({ where: { id: productId } });
  return convertToPlainObject(data);
}

//get all products
export async function getAllMenus({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  //QUERY FILTER: search by name from the SEARCHBOX INPUT
  const queryFilter: Prisma.MenuWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  //Category filter
  const categoryFilter: Prisma.MenuWhereInput =
    category && category != "all" ? { category } : {};

  //Price filter
  const priceFilter: Prisma.MenuWhereInput =
    price && price != "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  //Rating filter
  const ratingFilter: Prisma.MenuWhereInput =
    rating && rating !== "all" ? { rating: { gte: Number(rating) } } : {};

  const data = await prisma.menu.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
          ? { price: "desc" }
          : sort === "rating"
            ? { rating: "desc" }
            : { createdAt: "desc" },
  });
  const dataCount = await prisma.menu.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//DELETE A PRODUCT
export async function deleteProduct(id: string) {
  try {
    const productExist = await prisma.menu.findFirst({
      where: { id },
    });

    if (!productExist) throw new Error("Product is not found");

    await prisma.menu.delete({ where: { id } });

    revalidatePath("/admin/products");

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    //validate and store the review
    const product = insertProductSchema.parse(data);

    //now create the review and store in the database
    await prisma.menu.create({ data: product });

    //navigate back to the page where it is being created in the admin page
    revalidatePath("/admin/products");

    return { success: true, message: "Product created successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.menu.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.menu.update({ where: { id: product.id }, data: product });

    revalidatePath("/admin/products");

    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//get all categories
export async function getAllCategories() {
  const data = await prisma.menu.groupBy({
    by: ["category"],
    _count: true,
  });
  return data;
}

// get all accompaniments split by category (starch / vegetable)
export async function getAllAccompaniments() {
  const data = await prisma.menuAccompaniment.findMany({
    orderBy: { name: "asc" },
  });

  return convertToPlainObject(data) as {
    id: string;
    name: string;
    category: string;
    description: string | null;
    price: string | null;
    image: string | null;
    isDefault: boolean;
    createdAt: Date;
  }[];
}

//get featurd products
export async function getFeaturedProducts() {
  const data = await prisma.menu.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return convertToPlainObject(data);
}
