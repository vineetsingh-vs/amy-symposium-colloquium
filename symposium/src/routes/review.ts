import express from "express";
import { 
    createReview,
    deleteReview, 
    getReviewById, 
    getReviews, 
    updateReview
} from "../controllers/review";

const router = express.Router();

router.route("/:reviewID").get(getReviewById).put(updateReview).delete(deleteReview);
router.route("/").get(getReviews).post(createReview);

export default router;
