import { Router } from "express";
import user from "./user/index.js";
import auth from "./auth/index.js";

const router = Router();

router.use("/users", user);
router.use("/auth", auth);

export default router;
