import Note from "../models/note.models.js";
import User from "../models/user.models.js";

export const getNotesByUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    const dbUser = await User.findOne({ id: userId });
    if (!dbUser) {
      throw new Error("User not found in DB");
    }
    const notes = await Note.find({ owner: dbUser._id });
    res.status(200).json(notes);
  } catch (error) {
    console.log(`Error getting notes: ${error.message}`);
    res.status(500).json(error);
  }
};

export const patchNote = async (req, res) => {
  try {
    const { noteId } = req.query;
    const updateFields = req.body;
    if (!noteId) {
      return res.status(400).json({ error: "Note ID is required" });
    }

    const note = await Note.findOne({ id: noteId });
    if (!note) {
      return res.status(404).json(error);
    }

    Object.keys(updateFields).forEach((key) => {
      note[key] = updateFields[key];
    });
    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      publishStatus: note.isPublic,
    });
  } catch (error) {
    console.error(`Error updating note: ${error.message}`);
    res.status(500).json(error);
  }
};

export const getPermissionLevelByUserId = async (req, res) => {
  try {
    const { noteId, userId } = req.query;
    if (!noteId || !userId) {
      throw new Error("noteId and userId are not found in query");
    }

    const dbUser = await User.findOne({ id: userId });
    if (!dbUser) {
      throw new Error("User not found in db");
    }

    const note = await Note.findOne({ id: noteId });

    const userInPermissionsArray = note.permissions.find((item) => {
      return item.user._id.equals(dbUser._id);
    });

    return res
      .status(200)
      .json(
        userInPermissionsArray ? userInPermissionsArray.permissionLevel : -1
      );
  } catch (error) {
    console.error(`Error in fetching permission level: ${error.message}`);
    res.status(500).json(error);
  }
};
