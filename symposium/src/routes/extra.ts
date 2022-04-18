import express from "express";
import {
    addLike,
    addDislike,
    getExtraComment
} from "../controllers/extra";

const router = express.Router();

router.route("/:commentID/like").put(addLike)
router.route("/:commentID/dislike").put(addDislike)
router.route("/:commentID").get(getExtraComment)

export default router;
