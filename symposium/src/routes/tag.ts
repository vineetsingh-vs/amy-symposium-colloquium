import express from "express";
import { getTags } from "../controllers/tag";

const router = express.Router();

router.post("/", getTags);

export default router;
