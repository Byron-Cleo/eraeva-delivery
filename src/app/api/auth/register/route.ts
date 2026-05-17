import { NextResponse } from "next/server";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { signUpFormSchema } from "@/lib/validators";

export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/sign-up", request.url));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } =
      signUpFormSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = hashSync(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Registration failed",
      },
      { status: 400 },
    );
  }
}
