import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    // password: {
    //   type: String,
    //   required: true,
    // },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
