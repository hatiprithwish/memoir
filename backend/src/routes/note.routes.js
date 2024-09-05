import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Router } from "express";
import {
  getPermissionLevelByUserId,
  getNotesByUser,
  patchNote,
} from "../controllers/note.controllers.js";

const router = Router();

router
  .route("/")
  .get(ClerkExpressRequireAuth(), getNotesByUser)
  .patch(patchNote);

router.route("/permission").get(getPermissionLevelByUserId);

export default router;
