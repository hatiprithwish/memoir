import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import ReactQuill from "react-quill";

const TextEditor = () => {
  const { user } = useUser();
  const [content, setContent] = useState("");

  const createNewNote = async (e: any) => {
    e.preventDefault();
    const data = new FormData();
    data.set("content", content);

    const response = await fetch("http://localhost:8000/note/createNote", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    const fetchedData = await response.json();

    return fetchedData;
  };
  return (
    <form onSubmit={createNewNote}>
      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
      />
      <button type="submit" disabled={!user}>
        {user ? "Save" : "Login to Save"}
      </button>
    </form>
  );
};

export default TextEditor;
