import express from "express";
import connectToDB from "./db/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

const app = express();

// DB connection
connectToDB()
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((error) => console.error("😥 MongoDB connection failed:", error));

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

const clerkClient = ClerkExpressWithAuth({
  apiKey: process.env.CLERK_SECRET_KEY,
});
app.use(clerkClient);

app.use(express.json());
app.use(express.static("public")); // for storing static files in public folder
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import noteRouter from "./routes/note.routes.js";

app.use("/user", userRouter);
app.use("/note", noteRouter);

export default app;
