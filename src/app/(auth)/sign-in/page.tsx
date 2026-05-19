import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import CredentialsSignInForm from "./credentials-signin-form";
import GoogleSignInButton from "./google-signin-button";
import RegisteredToast from "./registered-toast";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async (props: {
  searchParams: Promise<{ callbackUrl?: string; registered?: string; verified?: string; error?: string }>;
}) => {
  const session = await auth();

  const { callbackUrl } = await props.searchParams;
  //is there is a succefully logged in user, redirect to the home page
  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <RegisteredToast />
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              width={100}
              height={100}
              alt={`${APP_NAME}logo`}
              priority={true}
            />
          </Link>
        </CardHeader>
        <CardTitle className="text-center pb-4">Sign In</CardTitle>
        <CardContent className="space-y-4">
          <GoogleSignInButton callbackUrl={callbackUrl} />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or sign in with email
              </span>
            </div>
          </div>
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
