"use client";

import { useCallback, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EventCreationForm from "@/components/GCal/EventCreationForm";

const NOTE_SAVING_INTERVAL = 2000;

const SingleNotePage = () => {
  const { id: noteId } = useParams();
  const { user } = useUser();
  const [quill, setQuill] = useState(null);
  const toolbarOptions = ["bold", "italic", "underline", "strike", "image"];
  const [socket, setSocket] = useState();
  const [savingStatus, setSavingStatus] = useState("saving...");
  const [permissionLevel, setPermissionLevel] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("");
  const [note, setNote] = useState(null);

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
    const s = io(process.env.NEXT_PUBLIC_API_URL);
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
      if (permissionLevel > 1) quill.enable(); // only editors and owner can edit
    };
    socket.emit("load-note", noteId);
    socket.on("get-note", loadNoteHandler);

    return () => {
      socket.off("load-note", noteId);
      socket.off("get-note", loadNoteHandler);
    };
  }, [socket, quill, noteId, permissionLevel]);

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

  // Check permission Level
  useEffect(() => {
    const checkPermissions = async () => {
      if (!user) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}note/permission?noteId=${noteId}&userId=${user.id}`
        );
        const data = await response.json();
        setPermissionLevel(data);
      } catch (error) {
        console.error(`Error in fetching permission: ${error.message}`);
      }
    };

    checkPermissions();
  }, [user, noteId]);

  // Private share
  const handlePrivateShare = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}note/permission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noteId: noteId,
          userEmail: emailInput,
          permission: selectedPermission,
        }),
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  // Get Note by Id
  useEffect(() => {
    if (!noteId) return;
    const fetchNote = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}note/getNoteByNoteId?noteId=${noteId}`
        );
        const data = await response.json();
        setNote(data);
      } catch (error) {
        console.error(`Error fetching note by noteId: ${error.message}`);
      }
    };
    fetchNote();
  }, [noteId]);

  return (
    <section className="p-4 w-full text-center">
      {!user && <p>Please sign in to see this note</p>}
      {user && <EventCreationForm />}
      {permissionLevel === null ? (
        <p>Loading...</p>
      ) : permissionLevel === -1 || note?.isPublic ? (
        <p>You do not have access to this note</p>
      ) : permissionLevel === 0 || (note?.isPublic && permissionLevel < 1) ? (
        <article>{note?.content?.ops[0]?.insert}</article>
      ) : (
        <>
          <div ref={wrapperRef}></div>
          <p className="text-sm text-gray-500">{savingStatus}</p>{" "}
        </>
      )}

      {permissionLevel === 0 && !note?.isPublic && (
        <div className="bg-red-200 rounded-full w-fit text-sm px-2">
          You can only view this note
        </div>
      )}

      <div className="flex justify-center items-center gap-6 ">
        {/* For owners */}
        {permissionLevel === 3 && (
          <Popover>
            <PopoverTrigger className="bg-primary-light hover:bg-primary-light/75 transition-all text-primary-dark px-4 py-2 rounded-md">
              Share
            </PopoverTrigger>
            <PopoverContent>
              <textarea
                rows={1}
                placeholder="Enter your friend's email"
                className="w-full p-1"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <div className="mt-3 flex flex-col">
                Permission Level:
                <div className="flex gap-2 text-sm mt-1">
                  <label>
                    <input
                      type="radio"
                      name="permission"
                      value="viewer"
                      checked={selectedPermission === "viewer"}
                      onChange={() => setSelectedPermission("viewer")}
                      className="mr-1 mt-1 inline-block"
                    />
                    Viewer
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="permission"
                      value="commenter"
                      checked={selectedPermission === "commenter"}
                      onChange={() => setSelectedPermission("commenter")}
                      className="mr-1 mt-1 inline-block"
                    />
                    Commenter
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="permission"
                      value="editor"
                      checked={selectedPermission === "editor"}
                      onChange={() => setSelectedPermission("editor")}
                      className="mr-1 mt-1 inline-block"
                    />
                    Editor
                  </label>
                </div>
                <button
                  className="self-end text-xs bg-zinc-300 hover:bg-zinc-300/50 transition-all text-primary-dark px-1.5 py-0.5 rounded-md mt-4"
                  onClick={handlePrivateShare}
                >
                  Save
                </button>
              </div>
            </PopoverContent>
          </Popover>
        )}
        {permissionLevel > 0 ||
          (note?.isPublic && (
            <button className="bg-primary-light hover:bg-primary-light/75 transition-all text-primary-dark px-4 py-2 rounded-md">
              Comment
            </button>
          ))}
      </div>
    </section>
  );
};

export default SingleNotePage;
