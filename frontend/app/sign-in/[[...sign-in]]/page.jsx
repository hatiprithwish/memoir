"use client";

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CustomSignIn() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        onSignInSuccess={() => router.push("/")}
        appearance={{
          elements: {
            formField: {
              borderColor: "#e2e8f0",
              borderRadius: "0.375rem",
              padding: "0.5rem",
            },
            button: {
              backgroundColor: "primary",
              borderRadius: "0.375rem",
              padding: "0.75rem 1.5rem",
            },
          },
        }}
      />
    </div>
  );
}
