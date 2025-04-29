import express from "express";
import {
  createRecipe,
  recipeById,
  recipesById,
  recommendedRecipes,
  updateRecipe,
} from "../../controllers/recipes/index.js";
import upload from "../../middlewares/uploaderImageRecipes.js";

const router = express.Router();

router.post("/create", upload.array("images", 3), createRecipe);
router.get("/:id", recipesById);
router.get("/recipe/:id", recipeById);
router.post("/recommended-recipes/:id", recommendedRecipes);
router.put("/edit/:id", upload.array("images", 3), updateRecipe);

export default router;
