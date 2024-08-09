import Router from "express";
import { createNote } from "../controllers/note.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/createNote").post(upload.none(), createNote);

export default router;
