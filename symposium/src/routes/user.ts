import express from "express";
import { createUser, getUser } from "../controllers/user";

const router = express.Router();

router.get("/:userID", getUser);
router.post("/", createUser);

export default router;
