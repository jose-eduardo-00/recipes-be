import express from "express";
import { createRecipe } from "../../controllers/recipes/index.js";
import upload from "../../middlewares/uploaderImageRecipes.js";

const router = express.Router();

router.post("/create", upload.array("images", 3), createRecipe);

export default router;
