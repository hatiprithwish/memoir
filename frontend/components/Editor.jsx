"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { EditorToolbar } from "./EditorToolbar";
import { ActiveUsers } from "./ActiveUsers";

const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export default function TextEditor({ docId }) {
  const [status, setStatus] = useState("connecting");
  const [users, setUsers] = useState([]);

  const editor = new Editor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: new Y.Doc(),
      }),
      CollaborationCursor.configure({
        provider: null,
        user: {
          name: "User " + Math.floor(Math.random() * 100),
          color: getRandomColor(),
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const doc = new Y.Doc();
    const provider = new WebsocketProvider("wss://demos.yjs.dev", docId, doc);

    provider.on("status", (status) => {
      setStatus(status);
    });

    provider.awareness.setLocalStateField("user", {
      name: "User " + Math.floor(Math.random() * 100),
      color: getRandomColor(),
    });

    provider.awareness.on("change", () => {
      const states = Array.from(provider.awareness.getStates().values());
      setUsers(states.map((state) => state.user));
    });

    editor.commands.setContent("");

    editor.chain().focus().setContent("Start typing here...").run();

    return () => {
      provider.disconnect();
      doc.destroy();
    };
  }, [editor, docId]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              status === "connected" ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {status === "connected" ? "Connected" : "Connecting..."}
          </span>
        </div>
        <ActiveUsers users={users} />
      </div>

      <EditorToolbar editor={editor} />

      <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
