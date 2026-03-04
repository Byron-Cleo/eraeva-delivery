"use server";

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { z } from "zod";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";

//sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in Successfully." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password." };
  }
}

//sign user out
export async function signOutUser() {
  await signOut();
}

//sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    //1. FORM DATA
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    //2. FORM DATA TO DATABASE.
    //create user in the database
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: "user",
        address: {
          fullName: "",
          streetAddress: "",
          city: "",
          postalCode: "",
          country: "",
        },
      },
    });

    //signin the user after successful creating in the db
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully." };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

//get user by their id
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("User not found.");

  return user;
}

//update user address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!currentUser) throw new Error("User not found.");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: {
        id: currentUser?.id,
      },
      data: {
        address,
      },
    });

    return { success: true, message: "User address updated successfully." };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//update user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const sesssion = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: sesssion?.user?.id },
    });
    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { name: user.name, email: user.email },
    });

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//DELETE A PRODUCT
export async function deleteUser(id: string) {
  try {
    const userExist = await prisma.user.findFirst({
      where: { id },
    });

    if (!userExist) throw new Error("User is not found");

    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

 //update user
  export async function updateUser(user: z.infer<typeof updateUserSchema>) {
    try {
      await prisma.user.update({
        where: {id: user.id},
        data: {
          name: user.name,
          role: user.role,
        }
      })

      revalidatePath("/admin/users");

      return {success: true, message: "User updated successfully"}
    } catch (error) {
      return {success: false, message: formatError(error)}
    }
  }
