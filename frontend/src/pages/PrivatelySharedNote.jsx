import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PrivatelySharedNote = () => {
  const { user } = useUser();
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    fetch(
      `http://localhost:8000/note/private-share/${id}?username=${user?.username}`
    )
      .then((response) => response.json())
      .then((data) => setNote(data))
      .catch((error) => console.error("Error fetching note:", error));
  }, [id, user]);

  console.log(note);
  return <div dangerouslySetInnerHTML={{ __html: note }} />;
};

export default PrivatelySharedNote;
