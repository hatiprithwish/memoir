import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PrivatelySharedNote = () => {
  const { user } = useUser();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  //Fetch note data and initial content
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

  const handleSave = async () => {
    const dataToUpdate = {
      noteId: id,
      note: noteContent,
    };
    await fetch(`http://localhost:8000/note/createNote/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToUpdate),
    })
      .then((response) => response.json())
      .then((updatedNote) => {
        setData(updatedNote);
        setIsEditing(false);
      })
      .catch((error) => console.error("Error saving note:", error));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleContentChange = (event) => {
    setNoteContent(event.target.value);
  };

  useEffect(() => {
    const handleLock = async () => {
      if (isEditing) {
        const response = await fetch(
          `http://localhost:8000/note/acquireNoteLock/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ noteId: id, username: user?.username }),
          }
        );

        const result = await response.json();
        if (result.success) {
          alert("This note is currently being edited by someone else.");
          setIsEditing(false);
        }
      } else {
        await fetch(`http://localhost:8000/note/releaseNoteLock/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ noteId: id }),
        });
      }
    };

    handleLock();

    // Clean up function
    return () => {
      if (isEditing) {
        fetch(`http://localhost:8000/note/releaseNoteLock/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ noteId: id }),
        });
      }
    };
  }, [isEditing, id, user.username]);

  return (
    <div>
      <p className="text-sm text-end text-yellow-400">
        Permission level: {data?.permissionLevel}
      </p>

      {data?.permissionLevel === "edit" ? (
        isEditing ? (
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
          <button
            onClick={handleEditToggle}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        )
      ) : (
        <div dangerouslySetInnerHTML={{ __html: noteContent }} />
      )}
    </div>
  );
};

export default PrivatelySharedNote;
