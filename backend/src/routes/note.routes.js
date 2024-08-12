import Router from "express";
import {
  createNote,
  createPrivatelySharedNote,
  getPrivatelySharedNote,
  getSharedNote,
} from "../controllers/note.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router
  .route("/createNote")
  .post(upload.none(), ClerkExpressWithAuth(), createNote);

router.route("/share/:id").get(ClerkExpressWithAuth(), getSharedNote);

router
  .route("/private-share/:id")
  .post(ClerkExpressWithAuth(), createPrivatelySharedNote)
  .get(ClerkExpressWithAuth(), getPrivatelySharedNote);

export default router;
