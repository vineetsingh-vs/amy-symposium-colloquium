import express from "express";
import { getComments } from "../controllers/comment";

const router = express.Router();

router.get("/", getComments);

export default router;
