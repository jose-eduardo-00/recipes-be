import express from "express";
import {
  allCategorys,
  createCategory,
  deleteCategory,
} from "../../controllers/category/index.js";

const router = express.Router();

router.post("/create", createCategory);
router.get("/", allCategorys);
router.delete("/delete/:id", deleteCategory);

export default router;
