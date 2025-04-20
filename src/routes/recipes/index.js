import express from "express";
import { createRecipe, recipesById } from "../../controllers/recipes/index.js";
import upload from "../../middlewares/uploaderImageRecipes.js";

const router = express.Router();

router.post("/create", upload.array("images", 3), createRecipe);
router.get("/", recipesById);

export default router;
