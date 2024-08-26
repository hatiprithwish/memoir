import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <section className="h-screen w-full flex flex-col justify-center items-center">
      <SignIn />;
    </section>
  );
};

export default SignInPage;
