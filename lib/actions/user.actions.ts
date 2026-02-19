"use server";

import { shippingAddressSchema, signInFormSchema, signUpFormSchema } from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { ShippingAddress } from "@/types";

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
        address: { pob: "205" },
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

  if(!user) throw new Error("User not found.");

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

    return {  success: true, message: "User address updated successfully." };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

