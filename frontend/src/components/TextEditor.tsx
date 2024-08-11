import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";

const TextEditor = () => {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const createNewNote = async (e: any) => {
    e.preventDefault();
    const data = new FormData();
    data.set("content", content);

    const token = await getToken();

    await fetch("http://localhost:8000/note/createNote", {
      method: "POST",
      body: data,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error.message));
  };

  useEffect(() => {
    createNewNote();
  }, []);
  return (
    <form onSubmit={createNewNote}>
      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
      />
      <button type="submit" disabled={!user} className="mt-4">
        {user ? "Save" : "Login to Save"}
      </button>
    </form>
  );
};

export default TextEditor;
