import { useEffect } from "react";
import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import "react-quill/dist/quill.snow.css";
import TextEditor from "./components/TextEditor";

function App() {
  const { user } = useUser();
  const { getToken } = useAuth();
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
      // console.log(dbUser);
      return dbUser;
    } catch (error: any) {
      console.error(`${error.message}`);
    }
  };

  useEffect(() => {
    getUser();
  }, [user]);

  useEffect(() => {
    const token = getToken();

    fetch("http://localhost:8000/protected-route", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  });

  return (
    <>
      <header className="flex-none flex justify-end">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <main className="flex-1 mt-16">
        <TextEditor />
      </main>
    </>
  );
}

export default App;
