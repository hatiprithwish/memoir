import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PrivatelySharedNote = () => {
  const { user } = useUser();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(
      `http://localhost:8000/note/private-share/${id}?username=${user?.username}`
    )
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching note:", error));
  }, [id, user]);

  console.log(data);
  return (
    <div>
      <p className="text-sm text-end text-yellow-400">
        Permission level: {data.permissionLevel}
      </p>
      <div dangerouslySetInnerHTML={{ __html: data.note }} />
    </div>
  );
};

export default PrivatelySharedNote;
