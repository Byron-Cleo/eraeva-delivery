"use client"

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import {
  signInWithCredentials,
  resendVerification,
} from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

const ResendButton = ({ email }: { email: string }) => {
  const [resendState, resendAction] = useActionState(resendVerification, {
    success: false,
    message: "",
  });

  return (
    <form action={resendAction} className="mt-2">
      <input type="hidden" name="email" value={email} />
      {resendState.success ? (
        <p className="text-center text-sm text-green-600">
          {resendState.message}
        </p>
      ) : (
        <>
          {resendState.message && (
            <p className="text-center text-sm text-destructive">
              {resendState.message}
            </p>
          )}
          <ResendSubmitButton />
        </>
      )}
    </form>
  );
};

const ResendSubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full text-center text-sm text-primary underline underline-offset-4 hover:text-primary/80 disabled:opacity-50"
    >
      {pending ? "Sending..." : "Resend verification email"}
    </button>
  );
};

const SignInButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} className="w-full" variant="default">
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  );
};

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
    email: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="space-y-6">
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <div>
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={signInDefaultValues.email}
            />
          </div>
          <div>
            <Label htmlFor="password">Password:</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="password"
              defaultValue={signInDefaultValues.password}
            />
          </div>
          <div>
            <SignInButton />
          </div>
        </div>
      </form>
      {data && !data.success && (
        <div className="text-center text-destructive">
          <p className="text-sm">{data.message}</p>
          {data.email && <ResendButton email={data.email} />}
        </div>
      )}
      <div className="text-sm text-center text-muted-foreground">
        Do&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          target="_self"
          className="font-semibold text-primary hover:text-primary/80"
        >
          Register.
        </Link>
      </div>
    </div>
  );
};

export default CredentialsSignInForm;
