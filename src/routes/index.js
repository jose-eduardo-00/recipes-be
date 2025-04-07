import { Router } from "express";
import user from "./user/index.js";

const router = Router();

router.use("/users", user);

export default router;
