import express from "express";
import {
    createComment,
    deleteComment,
    getCommentById,
    getCommentList,
    updateComment,
} from "../controllers/comment";

const router = express.Router();

router.route("/:commentID").get(getCommentById).put(updateComment).delete(deleteComment);
router.route("/").get(getCommentList).post(createComment);

export default router;
