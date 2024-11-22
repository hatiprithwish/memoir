"use client";

import Editor from "@/components/Editor";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

const EditorPage = () => {
  const { docId } = useParams();
  const editor = useEditor();

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full p-4">
        {/* <Editor docId={docId} /> */}

        <EditorContent editor={editor} />
      </Card>
    </div>
  );
};

export default EditorPage;
