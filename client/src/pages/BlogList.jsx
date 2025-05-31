import React, { useEffect, useState } from 'react';
import { getAllBlogs } from '../services/api';
import { Link } from 'react-router-dom';
import { Heart, User, Calendar } from 'lucide-react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await getAllBlogs();
        setBlogs(response.data);
      } catch (err) {
        setError('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-40 text-base text-gray-300 sm:text-lg">
        Loading blogs...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-40 text-base font-semibold text-red-500 sm:text-lg">
        {error}
      </div>
    );

  return (
    <div className="max-w-5xl px-4 py-6 mx-auto bg-black sm:max-w-6xl sm:py-8">
      <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl sm:mb-6">
        All Blogs
      </h2>

      {blogs.length === 0 ? (
        <p className="text-sm text-gray-300 sm:text-base">
          No blogs available.
        </p>
      ) : (
        <ul className="space-y-4 sm:space-y-6">
          {blogs.map((blog) => (
            <li
              key={blog._id}
              className="p-4 transition-all duration-300 transform bg-gray-800 shadow-lg rounded-xl sm:p-6 hover:shadow-xl hover:scale-105"
            >
              <Link to={`/blogs/${blog._id}`}>
                <h3 className="text-lg font-semibold text-white transition-colors sm:text-xl hover:text-gray-400">
                  {blog.title}
                </h3>
              </Link>

              <div className="flex flex-col gap-2 mt-2 text-xs text-gray-300 sm:flex-row sm:items-center sm:gap-4 sm:mt-3 sm:text-sm">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4 text-gray-300 sm:w-5 sm:h-5" />
                  <span>{blog.author?.username || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-300 sm:w-5 sm:h-5" />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500 sm:w-5 sm:h-5" />
                  <span>{blog.likes.length}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogList;