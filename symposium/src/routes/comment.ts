import express from "express";
import {
    createComment,
    deleteComment,
    getCommentById,
    getCommentList,
    getCommentsByVersionAndPage,
    getCommentsByVersionId,
    updateComment,
    addLike,
    addDislike
} from "../controllers/comment";

const router = express.Router();

router.route("/:commentID").get(getCommentById).put(updateComment).delete(deleteComment);
router.route("/:paperID/:versionID").get(getCommentsByVersionId);
router.route("/:paperID/:versionID/:page").get(getCommentsByVersionAndPage);
router.route("/").get(getCommentList).post(createComment);
router.route("/:commentID/like").put(addLike)
router.route("/:commentID/dislike").put(addDislike)

export default router;
