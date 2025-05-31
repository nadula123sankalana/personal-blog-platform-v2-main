import Blog from "../models/Blog.js";

// Create a new post
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Handle uploaded image path from multer middleware
    let coverImagePath = "";
    if (req.file) {
      coverImagePath = `/uploads/blogs/${req.file.filename}`;
    } else if (req.body.coverImage) {
      // fallback if coverImage sent in body (optional)
      coverImagePath = req.body.coverImage;
    }

    const newPost = new Blog({
      title,
      content,
      coverImage: coverImagePath,
      author: req.user.id, // authenticated user ID
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Create failed", error: err.message });
  }
};

// Get all posts with optional search
export const getAllBlogs = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }

    const posts = await Blog.find(query)
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// Get single post
export const getBlogById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate("author", "username avatar");

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// Update post
export const updateBlog = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const { title, content } = req.body;

    // Update fields if provided
    post.title = title || post.title;
    post.content = content || post.content;

    // If new image uploaded, update coverImage
    if (req.file) {
      post.coverImage = `/uploads/blogs/${req.file.filename}`;
    } else if (req.body.coverImage !== undefined) {
      // else if coverImage provided in body (optional)
      post.coverImage = req.body.coverImage;
    }

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// Delete post
export const deleteBlog = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await Blog.deleteOne({ _id: post._id });
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

// Like or unlike a post
export const likePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      // Unlike post
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like post
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: "Like action failed", error: err.message });
  }
};

// Get recent posts for homepage feed
export const getRecentPosts = async (req, res) => {
  try {
    const posts = await Blog.find()
      .populate("author", "username avatar")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Fetch recent posts failed", error: err.message });
  }
};
