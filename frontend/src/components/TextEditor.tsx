import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import ShareWithModal from "./ShareWithModal";

const TextEditor = () => {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const { getToken } = useAuth();
  const [noteLink, setNoteLink] = useState("");
  const [privateNoteLink, setPrivateNoteLink] = useState("");
  const [allUsers, setAllUsers] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const handlePrivateShare = async (permission: string) => {
    const postData = {
      username: user?.username,
      noteId: noteLink,
      permission: permission,
    };
    console.log(postData);
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
    <>
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
      <form onSubmit={handleFormSubmit}>
        <ReactQuill
          value={content}
          onChange={(newValue) => setContent(newValue)}
          className="min-h-32"
        />
        <button type="submit" disabled={!user} className="mt-4">
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
    </>
  );
};

export default TextEditor;
