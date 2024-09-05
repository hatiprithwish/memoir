import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import Note from "./models/note.models.js";
import User from "./models/user.models.js";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(`Connected to DB 🎊`);
  } catch (error) {
    console.error(`😥 Failed to connect to DB: ${error.message}`);
  }
};
connectToDB();

const server = createServer(app);
server.listen(process.env.PORT, () => {
  console.log(`server listening on: ${process.env.PORT}`);
});
export const socket = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
socket.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("create-note", async (noteId, ownerId) => {
    const existingUser = await User.findOne({ id: ownerId });
    if (!existingUser) {
      throw new Error("User not found");
    }
    const note = await Note.create({
      id: noteId,
      owner: existingUser._id,
      permissions: [{ user: existingUser._id, permissionLevel: 3 }],
    });

    socket.join(noteId);
  });

  socket.on("save-note", async (noteId, data) => {
    const note = await Note.findOneAndUpdate(
      { id: noteId },
      { $set: { content: data } },
      { new: true }
    );
    // console.log("note updated");
    socket.broadcast.to(noteId).emit("receive-changes", note?.content);
  });

  socket.on("load-note", async (noteId) => {
    const note = await Note.findOne({ id: noteId });
    socket.emit("get-note", note?.content);
  });

  socket.on("send-changes", (noteId, delta) => {
    console.log(delta);
    socket.broadcast.to(noteId).emit("receive-changes", delta);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

import noteRouter from "./routes/note.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/note", noteRouter);
app.use("/user", userRouter);

export default app;
