import express from "express";
import connectToDB from "./db/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { Server } from "socket.io";
import { createServer } from "node:http";
import findOrCreateNote from "./utils/findOrCreateNote.js";
import { Note } from "./models/note.models.js";

const app = express();

// ----- Socket.io connection -----

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateNote(documentId);
    socket.join(documentId);

    socket.emit("load-document", document.content);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      if (!documentId) {
        throw new Error("documentId is required");
      }

      await Note.findOneAndUpdate(
        { documentId: documentId },
        { content: data }
      );

      console.log("doc saved");
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server listening on: ${process.env.PORT}`);
});

// ----- MongoDB connection -----
connectToDB();

// ----- CORS -----
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public")); // for storing static files in public folder
app.use(cookieParser());

// ---------- Clerk Connection ----------
const clerkClient = ClerkExpressWithAuth({
  apiKey: process.env.CLERK_SECRET_KEY,
});
app.use(clerkClient);

import userRouter from "./routes/user.routes.js";
import noteRouter from "./routes/note.routes.js";

app.use("/user", userRouter);
app.use("/note", noteRouter);

export default app;
