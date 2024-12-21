import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  manifest: "/manifest.json",
  title: "Memoir",
  description: "World's best note taking app (according to me)",
};

export const viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <ClerkProvider>
        <html lang="en">
          <body className={`${inter.className} min-h-screen flex flex-col`}>
            <Navbar />
            <main className="flex flex-col items-center flex-1 w-full max-w-6xl mx-auto">
              {children}
            </main>
          </body>
        </html>
      </ClerkProvider>
    </GoogleOAuthProvider>
  );
}
