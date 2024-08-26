import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SharedNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/note/share/${id}`)
      .then((response) => response.json())
      .then((data) => setNote(data))
      .catch((error) => console.error("Error fetching note:", error));
  }, [id]);

  return <div dangerouslySetInnerHTML={{ __html: note }} />;
};

export default SharedNote;
