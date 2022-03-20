import express from "express";
import { getReviews } from "../controllers/review";

const router = express.Router();

router.get("/", getReviews);

export default router;
