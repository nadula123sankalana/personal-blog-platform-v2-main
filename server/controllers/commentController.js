import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';

// Create a comment
export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    if (!content || !postId) {
      return res.status(400).json({ message: 'Content and postId are required' });
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      post: postId,
    });
    await comment.save();

    // Update Blog model to include comment reference
    await Blog.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await Comment.deleteOne({ _id: req.params.commentId });
    // Remove comment reference from Blog
    await Blog.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};