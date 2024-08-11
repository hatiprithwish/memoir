import Router from "express";
import { getUser } from "../controllers/user.controllers.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.route("/fetchUser").post(ClerkExpressWithAuth(), getUser);

export default router;
