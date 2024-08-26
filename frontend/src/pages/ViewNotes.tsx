import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useUser } from "@clerk/clerk-react";

const ViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user }: any = useUser();

  useEffect(() => {
    const fetchNotesByUsername = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_REACT_BASE_API}note/getNotes/?username=${
            user.username
          }`
        );
        const data = await response.json();
        setNotes(data);
      } catch (error: any) {
        console.error(`Error while fetching notes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNotesByUsername();
  }, []);

  return (
    <Layout>
      <section className="p-4">
        {loading ? (
          <>World's best app is Loading...</>
        ) : notes.length === 0 ? (
          <>You haven't yet created any note</>
        ) : (
          <div>
            {notes.map((note) => (
              <div
                dangerouslySetInnerHTML={{ __html: note }}
                className="h-24 bg-primary-light w-full p-4 rounded-md my-4"
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default ViewNotes;
