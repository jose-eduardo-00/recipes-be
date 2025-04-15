import express from "express";
import { createRecipe } from "../../controllers/recipes/index.js";

const router = express.Router();

router.post("/create", createRecipe);

export default router;
