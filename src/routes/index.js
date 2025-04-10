import { Router } from "express";
import user from "./user/index.js";
import auth from "./auth/index.js";
import category from "./categorys/index.js";

const router = Router();

router.use("/users", user);
router.use("/auth", auth);
router.use("/category", category);

export default router;
