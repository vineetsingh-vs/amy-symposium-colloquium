import express from "express";
import { getComments } from "../controllers/comment";

const router = express.Router();

router.post("/", getComments);

export default router;
