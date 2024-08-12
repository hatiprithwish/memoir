import Router from "express";
import {
  acquireNoteLock,
  createNote,
  createPrivatelySharedNote,
  getPrivatelySharedNote,
  getSharedNote,
  releaseNoteLock,
  updateNote,
} from "../controllers/note.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router
  .route("/createNote")
  .post(upload.none(), ClerkExpressWithAuth(), createNote)
  .put(upload.none(), ClerkExpressWithAuth(), updateNote);

router.route("/share/:id").get(ClerkExpressWithAuth(), getSharedNote);

router
  .route("/private-share/:id")
  .post(ClerkExpressWithAuth(), createPrivatelySharedNote)
  .get(ClerkExpressWithAuth(), getPrivatelySharedNote);

router.route("/acquireNoteLock").post(ClerkExpressWithAuth(), acquireNoteLock);
router.route("/releaseNoteLock").post(ClerkExpressWithAuth(), releaseNoteLock);

export default router;
