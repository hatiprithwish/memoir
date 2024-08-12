import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    content: { type: String, required: true, index: true },
    lockedBy: { type: String, default: null },
    sharedWith: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        permission: {
          type: String,
          enum: ["read-only", "edit"],
          required: true,
          default: "read-only",
        },
      },
    ],
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
