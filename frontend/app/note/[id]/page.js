"use client";

import { useCallback, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

const NOTE_SAVING_INTERVAL = 2000;

const SingleNotePage = () => {
  const { id: noteId } = useParams();
  const { user } = useUser();
  const [quill, setQuill] = useState(null);
  const toolbarOptions = ["bold", "italic", "underline", "strike", "image"];
  const [socket, setSocket] = useState();
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

    q.disable();
    q.setText("Loading...");
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

  // Load note
  useEffect(() => {
    if (!socket || !quill) return;
    const loadNoteHandler = (note) => {
      quill.setContents(note);
      quill.enable();
    };
    socket.emit("load-note", noteId);
    socket.on("get-note", loadNoteHandler);

    return () => {
      socket.off("load-note", noteId);
      socket.off("get-note", loadNoteHandler);
    };
  }, [socket, quill, noteId]);

  // Send changes
  useEffect(() => {
    if (!socket || !quill || !noteId) return;
    const textChangeHandler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", noteId, delta);
    };
    quill.on("text-change", textChangeHandler);

    return () => {
      quill.off("text-change", textChangeHandler);
    };
  }, [socket, quill, noteId]);

  //Receive changes
  useEffect(() => {
    if (!socket || !quill) return;
    const receiveChangeHandler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", receiveChangeHandler);
    setSavingStatus("saved");

    return () => {
      socket.off("receive-changes", receiveChangeHandler);
    };
  }, [socket, quill]);

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
      <p className="text-sm text-gray-500">{savingStatus}</p>
    </section>
  );
};

export default SingleNotePage;
