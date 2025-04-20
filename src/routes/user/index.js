import express from "express";
import {
  allUsers,
  createUser,
  deleteUser,
  editActivatedUser,
  editUser,
} from "../../controllers/user/index.js";
import upload from "../../middlewares/uploaderImageUsers.js";

const router = express.Router();

router.post("/register", createUser);
router.get("/", allUsers);
router.put("/edit-activated/:id", editActivatedUser);
router.delete("/delete/:id", deleteUser);
router.put("/edit/:id", upload.single("avatar"), editUser);

export default router;
