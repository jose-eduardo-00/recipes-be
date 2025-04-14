import express from "express";
import {
  allUsers,
  createUser,
  deleteUser,
  editActivatedUser,
} from "../../controllers/user/index.js";

const router = express.Router();

router.post("/register", createUser);
router.get("/", allUsers);
router.put("/edit-activated/:id", editActivatedUser);
router.delete("/delete/:id", deleteUser);

export default router;
