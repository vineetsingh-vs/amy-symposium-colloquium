import express from "express";
import { getReviews } from "../controllers/review";

const router = express.Router();

router.post("/", getReviews);

export default router;
