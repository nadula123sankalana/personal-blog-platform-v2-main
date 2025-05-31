import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getRecentBlogs } from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getRecentBlogs();
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/blogs/${postId}`);
  };

  return (
    <div className="flex justify-center min-h-screen px-3 py-6 bg-gray-100 sm:px-4 sm:py-10">
      <div className="w-full max-w-5xl p-4 bg-white rounded-lg sm:p-6">
        {/* Heading */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Welcome{user?.username ? `, ${user.username}` : ''}
          </h2>
        </div>

        {/* Recent Posts */}
        <div>
          <h3 className="mb-3 text-lg font-semibold sm:text-xl sm:mb-4">Recent Posts</h3>

          {posts.length > 0 ? (
            <div className="space-y-4 sm:space-y-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {posts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => handlePostClick(post._id)}
                  className="px-4 py-3 transition duration-200 bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer sm:px-6 sm:py-5 sm:hover:shadow-lg sm:hover:bg-gray-50"
                >
                  <h4 className="mb-1 text-xl font-semibold text-gray-800 sm:text-2xl sm:mb-2">{post.title}</h4>
                  <div
                    className="text-sm leading-relaxed text-gray-700 sm:text-base"
                    dangerouslySetInnerHTML={{ __html: post.content.substring(0, 160) + '...' }}
                  />
                  <p className="mt-2 text-xs text-gray-500 sm:text-sm sm:mt-3">
                    Posted by {post.author?.username || 'Unknown'} on{' '}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 sm:text-base">No recent posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;