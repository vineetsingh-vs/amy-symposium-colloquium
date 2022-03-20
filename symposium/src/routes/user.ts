import express from "express";
import { getUser } from "../controllers/user";

const router = express.Router();

router.get("/me", getUser);

export default router;
