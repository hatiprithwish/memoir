import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import "react-quill/dist/quill.snow.css";
import TextEditor from "./components/TextEditor";
import { Route, Routes } from "react-router-dom";
import SharedNote from "./pages/SharedNote";
import PrivatelySharedNote from "./pages/PrivatelySharedNote";

function App() {
  return (
    <>
      <header className="flex-none flex justify-end">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <main className="flex-1 mt-16">
        <Routes>
          <Route path="/" element={<TextEditor />} />
          <Route path="/note/:id" element={<SharedNote />} />
          <Route path="/note/private/:id" element={<PrivatelySharedNote />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
