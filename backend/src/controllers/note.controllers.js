import { clerkClient } from "@clerk/clerk-sdk-node";
import { Note } from "../models/note.models.js";
import { decryptNote, encryptNote } from "../utils/cryptography.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

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
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // const notesToday = await Note.find({
    //   createdAt: {
    //     $gte: today,
    //   },
    // });
    // if (notesToday.length >= 3) {
    //   return res
    //     .status(403) //status code for absence of necessary permissions
    //     .json({ message: "You can only create 3 notes per day" });
    // }

    const newNote = await Note.create({ content: encryptedNote });

    const noteUID = newNote._id;
    return res.status(200).send(noteUID);
  } catch (error) {
    console.error(`Failed to create note: ${error.message}`);
    return res
      .status(500)
      .json({ message: `Failed to create note: ${error.message}` });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { noteId, note } = req.body;

    if (!note) {
      throw new Error("Empty note received");
    }

    const objectId = new mongoose.Types.ObjectId(
      String(noteId).substring(0, 24)
    );

    await Note.findByIdAndUpdate(
      { _id: objectId },
      { $set: { content: encryptNote(note) } },
      { new: true }
    );

    return res.status(200).json("Note updated successfully");
  } catch (error) {
    console.error(`Failed to update note: ${error.message}`);
    return res
      .status(500)
      .json({ message: `Failed to update note: ${error.message}` });
  }
};

export const getSharedNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("No noteId found");
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: `No note found` });
    } else {
      return res.status(200).json(decryptNote(note.content));
    }
  } catch (error) {
    console.error(`Failed to get shared note: ${error.message}`);
    return res
      .status(500)
      .json({ message: `Failed to get shared note: ${error.message}` });
  }
};

export const createPrivatelySharedNote = async (req, res) => {
  try {
    const { noteId, username, permission } = req.body;

    if (!noteId) {
      return res.status(400).json({ message: "No noteId found" });
    }

    const objectId = new mongoose.Types.ObjectId(noteId);

    const note = await Note.findById(objectId);
    if (!note) {
      return res.status(404).json({ message: "No note found" });
    }

    const dbUser = await User.findOne({ username });
    if (!dbUser) {
      return res.status(404).json({ message: "User not logged in" });
    }

    // Add the user to the sharedWith array if not already shared
    const isAlreadyShared = note.sharedWith.some((userId) =>
      userId.equals(dbUser._id)
    );

    if (!isAlreadyShared) {
      await Note.updateOne(
        { _id: objectId },
        { $addToSet: { sharedWith: { user: dbUser._id, permission } } }
      );
    }

    const privateUID = note._id.toString().concat(note.createdAt.toISOString());

    const decryptedContent = decryptNote(note.content);

    return res.status(200).json({ content: decryptedContent, privateUID });
  } catch (error) {
    console.error(`Failed to create privately shared note: ${error.message}`);
    return res.status(500).json({
      message: `Failed to create privately shared note: ${error.message}`,
    });
  }
};

export const getPrivatelySharedNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.query;

    const noteObjectId = String(id).substring(0, 24);
    const note = await Note.findById(noteObjectId);

    const dbUser = await User.findOne({ username });
    const isSharedWith = note.sharedWith.filter((item) =>
      item.user.equals(dbUser?._id)
    );
    if (!dbUser || !isSharedWith) {
      return res.status(403).json("User doesn't have access to this note");
    } else {
      const decryptedContent = decryptNote(note.content);

      const response = {
        note: decryptedContent,
        permissionLevel: isSharedWith[0].permission,
      };

      return res.status(200).json(response);
    }
  } catch (error) {
    console.error(`Failed to get privately shared note: ${error.message}`);
    return res.status(500).json({
      message: `Failed to get privately shared note: ${error.message}`,
    });
  }
};
