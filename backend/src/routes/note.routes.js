import Router from "express";
import { createNote } from "../controllers/note.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router
  .route("/createNote")
  .post(upload.none(), ClerkExpressWithAuth(), createNote);

export default router;
