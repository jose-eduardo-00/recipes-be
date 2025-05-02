import express from "express";
import {
  login,
  checkToken,
  logout,
  sendEmail,
  changePass,
} from "../../controllers/auth/index.js";

const router = express.Router();

router.post("/login", login);
router.post("/check", checkToken);
router.post("/logout", logout);
router.post("/confirm-email", sendEmail);
router.post("/change-pass/:id", changePass);

export default router;
