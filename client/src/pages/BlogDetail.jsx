import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { Heart, Pencil, Trash2, Send, User, Calendar } from "lucide-react";

const BlogDetail = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [likeProcessing, setLikeProcessing] = useState(false);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/blogs/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load post");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/post/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    if (!userId) return alert("Please login to like posts");
    if (likeProcessing) return;
    setLikeProcessing(true);
    try {
      const res = await api.put(`/blogs/${id}/like`);
      setPost((prev) => ({ ...prev, likes: res.data.likes }));
    } catch (err) {
      console.error(err);
      alert("Like failed");
    } finally {
      setLikeProcessing(false);
    }
  };

  const handleAddComment = async () => {
    if (!userId) return alert("Please login to comment");
    if (!newComment.trim()) return;

    try {
      const res = await api.post("/comments", {
        content: newComment.trim(),
        postId: id,
      });
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  if (loading) return <p className="text-base text-center text-gray-300 sm:text-lg">Loading post...</p>;
  if (!post) return <p className="text-base text-center text-gray-300 sm:text-lg">Post not found</p>;

  const userLiked = post.likes.some((id) => id === userId || id === Number(userId));

  const backendBaseUrl = "http://localhost:5000"; // Replace with your backend base URL if different
  const imageUrl =
    post.coverImage && !post.coverImage.startsWith("http")
      ? backendBaseUrl + post.coverImage
      : post.coverImage;

  return (
    <div className="max-w-3xl px-4 py-6 mx-auto bg-black sm:max-w-4xl sm:py-8">
      {/* Blog Post Header */}
      <div className="p-4 mb-4 bg-gray-800 shadow-lg rounded-xl sm:p-6 sm:mb-6">
        <h1 className="mb-3 text-xl font-bold text-white sm:text-3xl sm:mb-4">{post.title}</h1>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-auto max-w-full mb-3 rounded-lg shadow-md sm:max-w-2xl sm:mb-4"
          />
        )}
        <div className="flex flex-col items-start gap-2 mb-3 text-gray-300 sm:flex-row sm:items-center sm:mb-4 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <User className="w-4 h-4 text-gray-300 sm:w-5 sm:h-5" />
            <p className="text-xs sm:text-sm">
              By <strong>{post.author.username}</strong>
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Calendar className="w-4 h-4 text-gray-300 sm:w-5 sm:h-5" />
            <p className="text-xs sm:text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div
        className="mb-6 prose-sm prose text-gray-300 prose-invert sm:prose-base sm:mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Action Buttons */}
      <div className="flex flex-col items-start gap-3 mb-6 sm:flex-row sm:items-center sm:gap-4 sm:mb-8">
        <button
          onClick={handleLike}
          disabled={likeProcessing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-300 transform hover:scale-105 ${
            userLiked ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
          } w-full sm:w-auto`}
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${userLiked ? "fill-current text-red-500" : ""}`} />
          {userLiked ? "Unlike" : "Like"} ({post.likes.length})
        </button>

        {post.author._id === userId && (
          <button
            onClick={() => navigate(`/blogs/${post._id}/edit`)}
            className="flex items-center w-full gap-2 px-4 py-2 text-white transition-all duration-300 transform bg-gray-600 rounded-lg hover:bg-gray-700 hover:scale-105 sm:w-auto"
          >
            <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
            Edit Post
          </button>
        )}
      </div>

      <hr className="mb-6 border-gray-700 sm:mb-8" />

      {/* Comments Section */}
      <h2 className="mb-4 text-lg font-semibold text-white sm:text-xl sm:mb-6">
        Comments ({comments.length})
      </h2>

      {userId ? (
        <div className="p-4 mb-6 bg-gray-800 shadow-lg rounded-xl sm:p-6 sm:mb-8">
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 text-sm text-white bg-gray-900 border border-gray-700 rounded-lg resize-none sm:p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:text-base"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="flex items-center w-full gap-2 px-4 py-2 mt-2 text-white transition-all duration-300 transform bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed sm:w-auto"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            Post Comment
          </button>
        </div>
      ) : (
        <p className="mb-4 text-sm text-gray-300 sm:text-base">Please login to add comments.</p>
      )}

      {comments.length === 0 && <p className="text-sm text-gray-300 sm:text-base">No comments yet.</p>}

      <ul className="space-y-4 sm:space-y-6">
        {comments.map((comment) => (
          <li key={comment._id} className="p-3 bg-gray-800 rounded-lg shadow-md sm:p-4">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
              <div>
                <p className="flex items-center gap-1 text-sm font-semibold text-white sm:gap-2 sm:text-base">
                  <User className="w-3 h-3 text-gray-300 sm:w-4 sm:h-4" />
                  {comment.author.username}
                </p>
                <p className="mt-1 text-sm text-gray-300 sm:text-base">{comment.content}</p>
                <p className="flex items-center gap-1 mt-1 text-xs text-gray-400 sm:text-sm sm:gap-2">
                  <Calendar className="w-3 h-3 text-gray-300 sm:w-4 sm:h-4" />
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              {comment.author._id === userId && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="flex items-center w-full gap-1 px-2 py-1 text-xs text-white transition-all duration-300 transform bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 sm:gap-2 sm:px-3 sm:w-auto sm:text-sm"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogDetail;