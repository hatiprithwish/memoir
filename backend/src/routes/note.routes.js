import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Router } from "express";
import { getNotesByUser } from "../controllers/note.controllers.js";

const router = Router();

router.route("/").get(ClerkExpressRequireAuth(), getNotesByUser);

export default router;
