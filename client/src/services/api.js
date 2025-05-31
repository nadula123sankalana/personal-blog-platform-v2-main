import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Adjust if needed

// Axios instance without default Content-Type header
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== AUTH APIs ==========
export const registerUser = (userData) => api.post("/auth/register", userData);
export const loginUser = (credentials) => api.post("/auth/login", credentials);

// ========== BLOG APIs ==========

// Get all blogs
export const getAllBlogs = () => api.get("/blogs");

// Get a single blog by ID
export const getBlogById = (id) => api.get(`/blogs/${id}`);

// Create a blog post with multipart/form-data
export const createBlog = (blogData) =>
  api.post("/blogs", blogData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Update a blog post with multipart/form-data
export const updateBlog = (id, blogData) =>
  api.put(`/blogs/${id}`, blogData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Delete a blog post
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);

// Like/Unlike a blog post
export const likeBlogPost = (postId) => api.put(`/blogs/${postId}/like`);

// Get recent blogs
export const getRecentBlogs = () => api.get("/blogs/recent");

// Search blogs by query param 'search'
export const searchBlogs = (search) =>
  api.get("/blogs/search", { params: { search } });

// ========== COMMENT APIs ==========

// Create a comment
export const createComment = (commentData) => api.post("/comments", commentData);

// Get comments for a blog post
export const getCommentsByPost = (postId) => api.get(`/comments/post/${postId}`);

// Delete a comment
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);

export default api;
