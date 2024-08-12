import Router from "express";
import { getAllUsers, getUser } from "../controllers/user.controllers.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.route("/fetchUser").post(ClerkExpressWithAuth(), getUser);
router.route("/getAllUsers").get(ClerkExpressWithAuth(), getAllUsers);

export default router;
