import Router from "express";
import { fetchUser } from "../controllers/user.controllers.js";

const router = Router();

router.route("/fetchUser").post(fetchUser);

export default router;
