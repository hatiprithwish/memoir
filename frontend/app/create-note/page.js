"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const NOTE_SAVING_INTERVAL = 2000;

const CreateNotePage = () => {
  const { user } = useUser();
  const [quill, setQuill] = useState(null);
  const toolbarOptions = ["bold", "italic", "underline", "strike", "image"];
  const [socket, setSocket] = useState();
  const noteCreatedRef = useRef(false);
  const [noteId, setNoteId] = useState(null);
  const [savingStatus, setSavingStatus] = useState("saving...");

  // Quill Setup
  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = ""; // clean slate everytime🌚

    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });

    setQuill(q);
  }, []);

  // Socket.io Setup
  useEffect(() => {
    const s = io("http://localhost:8000");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // Empty note creation
  useEffect(() => {
    if (!quill || !socket || !user || noteCreatedRef.current) return;
    const newNoteId = uuidv4();
    setNoteId(newNoteId);
    socket.emit("create-note", newNoteId, user?.id);
    noteCreatedRef.current = true;
  }, [quill, socket, user]);

  // Save note
  useEffect(() => {
    if (!socket || !quill || !noteId) return;
    const interval = setInterval(() => {
      socket.emit("save-note", noteId, quill.getContents());
      setSavingStatus("saved");
    }, NOTE_SAVING_INTERVAL);

    return () => clearInterval(interval);
  }, [socket, quill, noteId]);

  return (
    <section className="p-4 w-full">
      <div ref={wrapperRef}></div>

      <div className="flex justify-between items-center mt-4">
        <Link
          href={`/note/${noteId}`}
          className="bg-primary-light text-primary-dark px-4 py-2 rounded-md"
        >
          View Note
        </Link>
        <p className="text-sm text-gray-500">{savingStatus}</p>
      </div>
    </section>
  );
};

export default CreateNotePage;
