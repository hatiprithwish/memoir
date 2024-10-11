import { SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-primary-dark">
      <div className="p-4 flex gap-8 justify-end items-center w-full max-w-6xl mx-auto">
        <Link
          href="/create-note"
          className="text-sm text-white hover:text-semibold hover:text-primary-light transition-all"
        >
          Create Note
        </Link>
        <Link
          href="/"
          className="text-sm text-white hover:text-semibold hover:text-primary-light transition-all"
        >
          View Notes
        </Link>
        <SignedOut>
          <Link
            href="/sign-in"
            className="text-sm text-white hover:text-semibold hover:text-primary-light transition-all"
          >
            Sign in
          </Link>
        </SignedOut>
        <UserButton />
      </div>
    </header>
  );
};

export default Navbar;
