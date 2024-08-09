import express from "express";
import connectToDB from "./db/index.js";
import cors from "cors";
import { clerkMiddleware } from "./middlewares/clerk.middlewares.js";

const app = express();

connectToDB()
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((error) => console.error("😥 MongoDB connection failed:", error));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public")); // for storing static files in public folder
app.use(clerkMiddleware);

import userRouter from "./routes/user.routes.js";

app.use("/user", userRouter);

export default app;
