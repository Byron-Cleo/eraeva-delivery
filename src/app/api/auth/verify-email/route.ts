import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/sign-in?error=MissingVerificationParams", request.url),
      );
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL("/sign-in?error=InvalidVerificationToken", request.url),
      );
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token,
          },
        },
      });
      return NextResponse.redirect(
        new URL("/sign-in?error=VerificationTokenExpired", request.url),
      );
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    return NextResponse.redirect(
      new URL("/sign-in?verified=true", request.url),
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        `/sign-in?error=${error instanceof Error ? error.message : "VerificationFailed"}`,
        request.url,
      ),
    );
  }
}
