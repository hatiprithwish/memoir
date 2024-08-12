import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    content: { type: String, required: true, index: true },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
