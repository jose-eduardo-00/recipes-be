import { Router } from "express";
import user from "./user/index.js";
import auth from "./auth/index.js";
import category from "./categorys/index.js";
import recipes from "./recipes/index.js";

const router = Router();

router.use("/users", user);
router.use("/auth", auth);
router.use("/category", category);
router.use("/recipes", recipes);

export default router;
