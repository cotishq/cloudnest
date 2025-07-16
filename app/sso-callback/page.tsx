"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        await handleRedirectCallback({});
        router.push("/dashboard"); 
      } catch (err) {
        console.error("SSO Callback Error:", err);
      }
    };

    completeSignIn();
  }, []);

  return <p className="text-center p-8">Completing login, please wait...</p>;
}
