"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

const ViewNotes = () => {
  const [user, setUser] = useState();
  const { user: clerkUser } = useUser();

  useEffect(() => {
    if (!clerkUser) return;

    const getUserData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress.emailAddress,
            fullName: clerkUser.fullName,
            avatar: clerkUser.imageUrl,
            username: clerkUser.username,
          }),
        });
        const dbUser = await res.json();
        setUser(dbUser);
      } catch (error) {
        console.error(error.message);
      }
    };

    getUserData();
  }, [clerkUser]);

  console.log(user);

  return (
    <section>
      {!clerkUser ? (
        <p>
          <Link href="/sign-in" className="text-blue-500">
            Sign in
          </Link>{" "}
          to see your notes
        </p>
      ) : (
        <div>
          <h1>Your Notes</h1>
        </div>
      )}
    </section>
  );
};

export default ViewNotes;
