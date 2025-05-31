import express from "express";
import multer from "multer";
import { register, login, updateUserProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Setup multer for memory storage (we’ll save file in controller)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);

// Protected route for updating profile, including avatar upload
router.put("/profile", authMiddleware, upload.single("avatar"), updateUserProfile);

export default router;
