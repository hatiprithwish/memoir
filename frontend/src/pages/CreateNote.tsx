import Quill from "quill";
import "quill/dist/quill.snow.css";

import { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

const NOTE_SAVING_INTERVAL = 2000;

const CreateNote = () => {
  const [quill, setQuill] = useState<Quill>();
  const toolbarOptions = ["bold", "italic", "underline", "strike", "image"];
  // ---------- quill.js set up ----------

  const wrapperRef = useCallback((wrapper: HTMLElement) => {
    if (!wrapper) return;
    wrapper.innerHTML = ""; // clean slate 🌚

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

  // ---------- socket.io set up ----------
  const [socket, setSocket] = useState<Socket | undefined>();

  useEffect(() => {
    const s = io(import.meta.env.VITE_REACT_BASE_API);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // ---------- Save note automatically every 2 seconds ----------
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, NOTE_SAVING_INTERVAL);

    return () => clearInterval(interval);
  }, [socket, quill]);

  // ---------- Creating rooms with documentId ----------
  const { id: documentId } = useParams();

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.on("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  // ---------- Sending quill changes to server ----------
  useEffect(() => {
    if (!quill || !socket) return;

    const textChangeHandler = (delta: any, oldDelta: any, source: string) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", textChangeHandler);

    return () => {
      quill.off("text-change", textChangeHandler);
    };
  }, [socket, quill]);

  // ---------- Receiving quill changes from server ----------
  useEffect(() => {
    if (socket == null || quill == null) return;

    const receiveChangeHandler = (delta: any) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", receiveChangeHandler);

    return () => {
      socket.off("receive-changes", receiveChangeHandler);
    };
  }, [socket, quill]);

  return (
    <Layout>
      <section className="p-4" ref={wrapperRef}></section>
    </Layout>
  );
};

export default CreateNote;
