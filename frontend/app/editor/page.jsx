"use client";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { useEffect } from "react";
import { TiptapCollabProvider } from "@hocuspocus/provider";

const doc = new Y.Doc();

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Collaboration.configure({
        document: doc,
      }),
    ],
    content: "<p>Hello World! 🌎️</p>",
  });

  useEffect(() => {
    const provider = new TiptapCollabProvider({
      name: "document.name", // Unique document identifier for syncing. This is your document name.
      appId: "7j9y6m10", // Your Cloud Dashboard AppID or `baseURL` for on-premises
      token: "notoken", // Your JWT token
      document: doc,
    });
  }, []);

  return <EditorContent editor={editor} />;
};

export default Tiptap;
