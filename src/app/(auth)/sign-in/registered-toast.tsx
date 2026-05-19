"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const RegisteredToast = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast({
        variant: "success",
        description: (
          <>
            Account created successfully!<br />
            You can now log in.
          </>
        ),
        className: "text-center",
      });
    }

    if (searchParams.get("verified") === "true") {
      toast({
        variant: "success",
        description: (
          <>
            Email verified successfully!<br />
            You can now log in.
          </>
        ),
        className: "text-center",
      });
    }

    const error = searchParams.get("error");
    if (
      error &&
      ["InvalidVerificationToken", "VerificationTokenExpired", "MissingVerificationParams"].includes(error)
    ) {
      const messages: Record<string, string> = {
        MissingVerificationParams: "Invalid verification link.",
        InvalidVerificationToken: "Invalid or already used verification link.",
        VerificationTokenExpired: "Verification link has expired. Please register again.",
      };
      toast({
        variant: "destructive",
        description: messages[error] || "Verification failed.",
        className: "text-center",
      });
    }
  }, [searchParams, toast]);

  return null;
};

export default RegisteredToast;
