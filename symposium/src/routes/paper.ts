import express from "express";
import { getPapers } from "../controllers/paper";

const router = express.Router();

router.get("/", getPapers);

export default router;
