"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ViewNotes = () => {
  const [user, setUser] = useState();
  const { user: clerkUser } = useUser();
  const { isSignedIn, getToken } = useAuth();
  const [notes, setNotes] = useState([]);
  const router = useRouter();

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

  useEffect(() => {
    if (!isSignedIn) return;

    const getNotes = async () => {
      const token = await getToken();
      console.log(token);

      const res = await fetch(`http://localhost:8000/note`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const notes = await res.json();
      setNotes(notes);
    };
    getNotes();
  }, [user]);

  return (
    <section className="p-4 space-y-4">
      {!clerkUser ? (
        <p>
          <Link href="/sign-in" className="text-blue-500">
            Sign in
          </Link>{" "}
          to see your notes
        </p>
      ) : notes.length > 0 ? (
        <>
          <h1 className="text-2xl font-bold">Your Notes</h1>
          {notes.map((note) => {
            // console.log(note?.content?.ops[0]?.insert);
            return (
              <div
                onClick={() => {
                  router.push(`/note/${note.id}`);
                }}
                key={note.id}
                className="p-4 bg-primary-light rounded-md cursor-pointer"
              >
                {note?.content?.ops[0]?.insert && (
                  <p className="line-clamp-3">
                    {note?.content?.ops[0]?.insert}
                  </p>
                )}
              </div>
            );
          })}
        </>
      ) : (
        <p className="mt-16">No notes found 🥹</p>
      )}
    </section>
  );
};

export default ViewNotes;
