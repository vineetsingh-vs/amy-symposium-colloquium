import express from "express";
import { getTags } from "../controllers/tag";

const router = express.Router();

router.get("/", getTags);

export default router;
