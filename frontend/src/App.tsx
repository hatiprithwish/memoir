import { useUser } from "@clerk/clerk-react";
import { redirect, Route, Routes } from "react-router-dom";
import SharedNote from "./pages/SharedNote";
import PrivatelySharedNote from "./pages/PrivatelySharedNote";
import ViewNotes from "./pages/ViewNotes";
import { useEffect } from "react";
import Prelogin from "./pages/Prelogin";
import SignInPage from "./pages/SignInPage";
import CreateNote from "./pages/CreateNote";

function App() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      redirect("/prelogin");
    } else {
      redirect("/view-notes");
    }
  }, [user]);
  return (
    <Routes>
      <Route path="/" element={<ViewNotes />} />
      <Route path="/note/:id" element={<SharedNote />} />
      <Route path="/note/private/:id" element={<PrivatelySharedNote />} />
      <Route path="/view-notes" element={<ViewNotes />} />
      <Route path="/create-note" element={<CreateNote />} />
      <Route path="/prelogin" element={<Prelogin />} />
      <Route path="/sign-in" element={<SignInPage />} />
    </Routes>
  );
}

export default App;
