import { useEffect } from "react";
import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

function App() {
  const { user } = useUser();
  let dbUser;
  const getUser = async () => {
    try {
      if (!user) return null;

      const userId = user.id;
      const username = user.username;

      const data = await fetch(`http://localhost:8000/user/fetchUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, username }),
      });
      dbUser = await data.json();
      console.log(dbUser);
      return dbUser;
    } catch (error: any) {
      console.error(`${error.message}`);
    }
  };

  useEffect(() => {
    getUser();
  }, [user]);

  return (
    <>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <p className="bg-blue-200">{dbUser}</p>
    </>
  );
}

export default App;
