import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { updateProfile } from "../controllers/userController.js";

const router = express.Router();

// PUT /api/users/profile - update user profile with avatar upload
router.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"), // multer middleware to handle single file upload named 'avatar'
  updateProfile
);

export default router;
