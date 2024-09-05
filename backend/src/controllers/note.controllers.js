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
    res.status(500).json({ error: error.message });
  }
};
