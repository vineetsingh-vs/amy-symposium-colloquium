import express from "express";
import { loginCas, loginSocial, signUp, login } from "../controllers/auth";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login_cas", loginCas);
router.post("/login_social", loginSocial);
router.post("/login", login);

export default router;
