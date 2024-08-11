import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    content: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
