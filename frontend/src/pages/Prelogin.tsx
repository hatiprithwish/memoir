import { Link, redirect } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { SignIn, SignInButton } from "@clerk/clerk-react";

const Prelogin = () => {
  {
    /* <header className="flex-none flex justify-end">
      <SignedOut>
      <SignInButton />
      </SignedOut>
      <SignedIn>
      <UserButton />
      </SignedIn>
      </header> */
  }
  return (
    <Layout isSideNavHidden={true}>
      <section className="h-screen w-full flex flex-col justify-center items-center space-y-4">
        <img
          src="/auth/who-are-you.svg"
          width={150}
          height={150}
          alt="user-icon"
        />
        <div className="text-lg">😱 Who are you!</div>
        <div>
          Please{" "}
          <Link to="/sign-in" className="text-blue-600 underline">
            Sign in
          </Link>{" "}
          to use World's best app 😻
        </div>
      </section>
    </Layout>
  );
};

export default Prelogin;
