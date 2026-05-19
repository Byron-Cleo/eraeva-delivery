"use server";

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { z, ZodError } from "zod";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/db/generated/prisma/client";
import { getMyCart } from "./cart.actions";

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

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { email: true, emailVerified: true },
    });

    if (existingUser && !existingUser.emailVerified) {
      return {
        success: false,
        email: existingUser.email,
        message:
          "Please verify your email address before signing in. Check your email inbox or Spam folder to verify your email address first.",
      };
    }

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
  // get current users cart and delete it so it does not persist to next user
  const currentCart = await getMyCart();
  if (currentCart) await prisma.cart.delete({ where: { id: currentCart?.id } });
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

    user.password = hashSync(user.password, 10);

    //2. FORM DATA TO DATABASE.
    //create user in the database
    const newUser = await prisma.user.create({
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

    //3. GENERATE VERIFICATION TOKEN AND SEND EMAIL
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires,
      },
    });

    if (process.env.RESEND_API_KEY) {
      const { sendVerificationEmail } = await import("@/email");
      await sendVerificationEmail({
        name: newUser.name,
        email: user.email,
        token,
      });
    }

    return {
      success: true,
      message:
        "Account created successfully! Please check your email to verify your account before signing in.",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const path = issue.path[0] as string;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      return {
        success: false,
        message: "Please fix the errors below.",
        fieldErrors,
      };
    }

    if (formatError(error).includes("already exists")) {
      return {
        success: false,
        message: "",
        fieldErrors: { email: "This email is already taken." },
      };
    }

    return { success: false, message: formatError(error) };
  }
}

//resend verification email
export async function resendVerification(
  _prevState: { success: boolean; message: string },
  formData: FormData,
) {
  const email = formData.get("email") as string;
  if (!email) {
    return { success: false, message: "Email is required." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, emailVerified: true },
    });

    if (!user) {
      return { success: false, message: "No account found with that email." };
    }

    if (user.emailVerified) {
      return {
        success: false,
        message: "This email is already verified. You can sign in.",
      };
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    if (process.env.RESEND_API_KEY) {
      const { sendVerificationEmail } = await import("@/email");
      await sendVerificationEmail({ name: user.name, email, token });
    }

    return { success: true, message: "Verification email sent. Please check your inbox." };
  } catch (error) {
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
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  //search by name from the SEARCHBOX INPUT
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          // user: {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
          // }
        }
      : {};

  const data = await prisma.user.findMany({
    where: { ...queryFilter },
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
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath("/admin/users");

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
