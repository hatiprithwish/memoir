import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Router } from "express";
import {
  getPermissionLevelByUserId,
  getNotesByUser,
  patchNote,
  addOrUpdatePermission,
} from "../controllers/note.controllers.js";

const router = Router();

router
  .route("/")
  .get(ClerkExpressRequireAuth(), getNotesByUser)
  .patch(patchNote);

router
  .route("/permission")
  .get(getPermissionLevelByUserId)
  .post(addOrUpdatePermission);

export default router;
