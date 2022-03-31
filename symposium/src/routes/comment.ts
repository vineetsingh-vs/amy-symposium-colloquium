import express from "express";
import { 
    createComment, 
    deleteComment, 
    getCommentById, 
    getComments, 
    updateComment 
} from "../controllers/comment";

const router = express.Router();

router.route("/:commentID").get(getCommentById).put(updateComment).delete(deleteComment);
router.route("/").get(getComments).post(createComment);

export default router;
