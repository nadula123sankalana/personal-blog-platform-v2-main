import express from "express";

import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likePost,
  getRecentPosts,
} from "../controllers/blogController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadBlog from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/recent", getRecentPosts); // Must be before /:id
router.get("/search", getAllBlogs); // New search route added
router.get("/", getAllBlogs);
router.get("/:id", getBlogById); // Dynamic route last

// Protected routes with multer middleware to handle image upload
router.post("/", authMiddleware, uploadBlog.single("coverImage"), createBlog);
router.put("/:id", authMiddleware, uploadBlog.single("coverImage"), updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);
router.put("/:postId/like", authMiddleware, likePost);

export default router;
