import express from "express";
import { login, checkToken, logout } from "../../controllers/auth/index.js";

const router = express.Router();

router.post("/login", login);
router.post("/check", checkToken);
router.post("/logout", logout);

export default router;
