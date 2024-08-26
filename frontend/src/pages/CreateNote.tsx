import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import ShareWithModal from "../components/TextEditor/ShareWithModal";

const CreateNote = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [noteLink, setNoteLink] = useState("");
  const [privateNoteLink, setPrivateNoteLink] = useState("");
  const [allUsers, setAllUsers] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  // ---------- quill.js set up ----------
  const [content, setContent] = useState("");
  const toolbarOptions = ["bold", "italic", "underline", "strike", "image"];

  const handlePrivateShare = async (permission: string) => {
    const postData = {
      username: user?.username,
      noteId: noteLink,
      permission: permission,
    };

    await fetch(`http://localhost:8000/note/private-share/${noteLink}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indicate that you're sending JSON
      },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((data) => setPrivateNoteLink(data.privateUID))
      .catch((err) => console.error(err));
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const data = new FormData();
    data.set("username", user?.username);
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
      .then((data) => setNoteLink(data.toString()))
      .catch((error) => console.error(error.message));
  };

  useEffect(() => {
    fetch("http://localhost:8000/user/getAllUsers")
      .then((res) => res.json())
      .then((data) => setAllUsers(data));
  }, []);
  return (
    <Layout>
      <section className="p-4">
        {user && noteLink.length > 0 && (
          <>
            <button className="mb-8" onClick={() => setIsModalOpen(true)}>
              Share with
            </button>
            {/* ----- Public Link ----- */}
            <div>
              {" "}
              Public URL:
              <a
                className="ml-8 cursor-pointer"
                href={`http://localhost:5173/note/${noteLink}`}
              >
                http://localhost:5173/note/{noteLink}
              </a>
            </div>
          </>
        )}
        <form
          onSubmit={handleFormSubmit}
          className="min-h-[70vh] flex flex-col"
        >
          <ReactQuill
            value={content}
            onChange={(newValue) => setContent(newValue)}
            className="flex-grow"
            modules={{ toolbar: toolbarOptions }}
          />
          <button
            type="submit"
            disabled={!user}
            className="mt-4 bg-primary-dark text-white hover:bg-primary-dark/75 w-fit rounded-md px-3 py-1.5 font-semibold"
          >
            {user ? "Save" : "Login to Save"}
          </button>
        </form>

        <ShareWithModal isOpen={isModalOpen} onClose={closeModal}>
          {allUsers?.length > 0 &&
            allUsers.map((user: any) => (
              <div
                key={user._id}
                className="flex items-center gap-4 text-lg font-semibold my-4"
              >
                {user.username}
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handlePrivateShare("edit");
                  }}
                >
                  Share for editing
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handlePrivateShare("read-only");
                  }}
                >
                  Share for reading
                </button>
              </div>
            ))}
        </ShareWithModal>

        {privateNoteLink && noteLink.length > 0 && (
          <a href={`http://localhost:5173/note/private/${privateNoteLink}`}>
            http://localhost:5173/note/private/{privateNoteLink}
          </a>
        )}
      </section>
    </Layout>
  );
};

export default CreateNote;
