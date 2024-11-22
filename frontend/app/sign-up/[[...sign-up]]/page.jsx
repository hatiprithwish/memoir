"use client"; // Add this line to make the component a client component

import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CustomSignUp() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        onSignUpSuccess={() => router.push("/")}
        appearance={{
          elements: {
            formField: {
              borderColor: "#e2e8f0",
              borderRadius: "0.375rem",
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
