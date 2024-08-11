import { clerkClient } from "@clerk/clerk-sdk-node";
import { Note } from "../models/note.models.js";
import { encryptNote } from "../utils/cryptography.js";

export const createNote = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      throw new Error("Empty note received");
    }
    const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    if (!clerkUser) {
      throw new Error("User is not logged in");
    }

    // ----- Encrypt incoming note -----
    const encryptedNote = encryptNote(content);

    // ----- 3 notes per day -----
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const notesToday = await Note.find({
      createdAt: {
        $gte: today,
      },
    });
    if (notesToday.length >= 3) {
      return res
        .status(403) //status code for absence of necessary permissions
        .json({ message: "You can only create 3 notes per day" });
    }

    await Note.create({ content: encryptedNote });
    return res.status(200).send({ message: "Note created successfully" });
  } catch (error) {
    console.error(`Failed to create note: ${error.message}`);
    return res
      .status(500)
      .json({ message: `Failed to create note: ${error.message}` });
  }
};
