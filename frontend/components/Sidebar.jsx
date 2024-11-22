"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

const Sidebar = () => {
  const [notes, setNotes] = useState([]);
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;
    const getNotes = async () => {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}note`, {
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
  }, [getToken, isSignedIn]);

  return (
    <div className="sidebar">
      <h2 className="text-lg font-bold">Your Notes</h2>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li key={note.id}>
            <Link
              href={`/note/${note.id}`}
              className="text-blue-600 hover:underline"
            >
              {note.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
