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
  }, [searchParams, toast]);

  return null;
};

export default RegisteredToast;
