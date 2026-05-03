"use server";

import z from "zod";
import { formatError } from "../utils";
import { insertReviewSchema } from "../validators";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

//this is the file that evrything that goes with the database, comes here

//action to created and update review
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>,
) {
  try {
    const session = await auth();
    if (!session)
      throw new Error(
        "User not authenticated: Please login to leave a review.",
      );

    //validate and store the review object
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    //Get product that is being reviewed
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });
    if (!product) throw new Error("Product not found");

    //check if user already reviewed a product
    const reviewExists = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        //Update the review
        await tx.review.update({
          where: { id: reviewExists.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        //Create the review
        await tx.review.create({
          data: review,
        });
      }

      //Get average rating
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      //Get number of reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      //finally update the rating and numReviews in the PRODUCT TABLE
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      });

      //revalidate path like to just remain in the same page where the review is
      //being created or updated from th modal form
      revalidatePath(`/product/${product.slug}`);
    });

    return { success: true, message: "Review updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//get all reviews for a product
//desc means from the newly most recent review
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: { productId },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return { data };
}

//get review written by current user
export async function geReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await auth();

  if (!session) throw new Error("User not found");

  return await prisma.review.findFirst({
    where: { productId, userId: session?.user?.id },
  });
}
