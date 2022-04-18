import express from "express";
import {
    addLike,
    addDislike

} from "../controllers/extra";

const router = express.Router();

router.route("/:commentID/like").put(addLike)
router.route("/:commentID/dislike").put(addDislike)

export default router;
