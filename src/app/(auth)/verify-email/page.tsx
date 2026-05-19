import { Mail } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

const VerifyEmailPage = async (props: {
  searchParams: Promise<{ email?: string }>;
}) => {
  const { email } = await props.searchParams;

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-xl">
            Verify your email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
          <p>
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
          <p>
            Please check your inbox and click the link to activate your{" "}
            {APP_NAME} account.
          </p>
          <p className="text-xs">
            Didn&apos;t receive the email? Check your spam folder, or{" "}
            <Link href="/sign-in" className="link">
              try signing in
            </Link>{" "}
            to request a new link.
          </p>
          <div className="pt-4">
            <Link
              href="/sign-in"
              className="inline-block rounded-md bg-primary px-6 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Go to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
