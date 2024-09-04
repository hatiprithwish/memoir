import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: Object,
    },
    editors: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    commenters: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    viewers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
