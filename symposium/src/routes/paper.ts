import express from "express";
import { getPapers } from "../controllers/paper";

const router = express.Router();

router.post("/", getPapers);

export default router;
