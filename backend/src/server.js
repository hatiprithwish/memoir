import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import connectToDB from "./config/db.config.js";
import initializeSocket from "./services/socket.io.services.js";
import noteRouter from "./routes/note.routes.js";
import userRouter from "./routes/user.routes.js";
import gCalRouter from "./routes/gCal.routes.js";

dotenv.config({ path: "./.env.local" });

const app = express();

app.get("/", (req, res) => res.send("Hello World"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

connectToDB();

const server = createServer(app);
server.listen(process.env.PORT, () => {
  console.log(`server listening on: ${process.env.PORT}`);
});

initializeSocket(server);

app.use("/note", noteRouter);
app.use("/user", userRouter);
app.use("/gCal", gCalRouter);

export default app;
