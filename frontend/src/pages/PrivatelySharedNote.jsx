import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PrivatelySharedNote = () => {
  const { user } = useUser();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    fetch(
      `http://localhost:8000/note/private-share/${id}?username=${user?.username}`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setNoteContent(data.note);
      })
      .catch((error) => console.error("Error fetching note:", error));
  }, [id, user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleContentChange = (event) => {
    setNoteContent(event.target.value);
  };

  const handleSave = async () => {
    const data = {
      noteId: id,
      note: noteContent,
    };
    await fetch(`http://localhost:8000/note/createNote/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header
      },
      body: JSON.stringify(data), // Convert data to JSON string
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsEditing(false);
      })
      .catch((error) => console.error("Error saving note:", error));
  };

  return (
    <div>
      <p className="text-sm text-end text-yellow-400">
        Permission level: {data?.permissionLevel}
      </p>
      {data?.permissionLevel === "edit" && !isEditing ? (
        <button
          onClick={handleEditToggle}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
      ) : data?.permissionLevel === "edit" && isEditing ? (
        <>
          <textarea
            value={noteContent}
            onChange={handleContentChange}
            className="w-full h-60 border p-2"
          />
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Save
          </button>
          <button
            onClick={handleEditToggle}
            className="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2"
          >
            Cancel
          </button>
        </>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: noteContent }} />
      )}
    </div>
  );
};

export default PrivatelySharedNote;
