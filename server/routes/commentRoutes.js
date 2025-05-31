import express from 'express';
import * as commentController from '../controllers/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, commentController.createComment);
router.get('/post/:postId', commentController.getCommentsByPost);
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

export default router;
