"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { handleNotePublish } from "@/utils";

const NOTE_SAVING_INTERVAL = 2000;

const CreateNote = () => {
  const { user } = useUser();
  const [quill, setQuill] = useState(null);
  const toolbarOptions = ["bold", "italic", "underline", "strike", "image"];
  const [socket, setSocket] = useState();
  const noteCreatedRef = useRef(false);
  const [noteId, setNoteId] = useState(null);
  const [savingStatus, setSavingStatus] = useState("saving...");
  const [publishStatus, setPublishStatus] = useState(false);
  const wrapperRef = useRef(null);

  // Quill Setup
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    wrapper.innerHTML = ""; // clean slate everytime🌚

    if (typeof window !== "undefined") {
      const editor = document && document.createElement("div");
      wrapper.append(editor);
      const q = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: toolbarOptions },
      });

      setQuill(q);
    }
  }, []);

  // Socket.io Setup
  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_API_URL);
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
        <div className="flex gap-4 items-stretch">
          <Link
            href={`/note/${noteId}`}
            className="bg-primary-light text-primary-dark px-4 py-2 rounded-md"
          >
            View Note
          </Link>
          <button
            className="bg-primary-light text-primary-dark px-4 py-2 rounded-md"
            onClick={async () => {
              setPublishStatus(await handleNotePublish(noteId, publishStatus));
            }}
          >
            {publishStatus ? "Published" : "Publish"}
          </button>
        </div>
        <p className="text-sm text-gray-500">{savingStatus}</p>
      </div>
    </section>
  );
};

export default CreateNote;
