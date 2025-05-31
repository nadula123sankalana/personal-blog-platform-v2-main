Personal Blog Platform
A full-stack blog platform built with Node.js, Express, and MongoDB, allowing users to register, create, and interact with blog posts through a RESTful API. The platform supports user authentication, blog post CRUD operations, and interactive features like liking and commenting on posts, with a responsive UI planned for the frontend.
Features

User Management:
Register and log in with JWT-based authentication.
Basic user profiles with username and avatar.

Blog Management:
Create, read, update, and delete (CRUD) blog posts.
Each post includes:
Title
Content (with rich text support)
Optional cover image
Creation date
Author information

Interactive Features:
Like or unlike blog posts.
Create, view, and delete comments on posts.
Homepage feed displaying the 10 most recent posts, sorted by creation date.

API Endpoints
Authentication

POST /api/auth/register
Register a new user.
Body: { "username": string, "password": string, "avatar": string }
Returns: User object and JWT token.

POST /api/auth/login
Log in and receive a JWT token.
Body: { "username": string, "password": string }
Returns: User object and JWT token.

Blogs

GET /api/blogs
Get all blog posts, sorted by creation date (descending).
Returns: Array of blog posts with author details.

GET /api/blogs/recent
Get the 10 most recent blog posts for the homepage feed.
Returns: Array of up to 10 blog posts with author details.

GET /api/blogs/:id
Get a single blog post by ID.
Returns: Blog post with author details.

POST /api/blogs
Create a new blog post (requires authentication).
Body: { "title": string, "content": string, "coverImage": string }
Returns: Created blog post.

PUT /api/blogs/:id
Update a blog post (requires authentication, must be post author).
Body: { "title": string, "content": string, "coverImage": string }
Returns: Updated blog post.

DELETE /api/blogs/:id
Delete a blog post (requires authentication, must be post author).
Returns: Success message.

POST /api/blogs/:id/like
Like or unlike a blog post (requires authentication).
Returns: Updated likes array.

Comments

POST /api/comments
Create a comment on a post (requires authentication).
Body: { "content": string, "postId": string }
Returns: Created comment.

GET /api/comments/post/:postId
Get all comments for a specific post.
Returns: Array of comments with author details.

DELETE /api/comments/:commentId
Delete a comment (requires authentication, must be comment author).
Returns: Success message.

Setup

Clone the Repository:git clone <repository-url>
cd personal-blog-platform

Install Dependencies:npm install

Configure Environment Variables:
Create a .env file in the server/ directory with the following:MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Replace your_mongodb_connection_string with your MongoDB URI (e.g., MongoDB Atlas) and your_jwt_secret with a secure secret key.

Start the Server:npm start

The server will run on http://localhost:5000 (or the port specified in PORT).

Project Structure
server/
├── controllers/
│ ├── authController.js # Handles user authentication
│ ├── blogController.js # Handles blog post CRUD and interactions
│ └── commentController.js # Handles comment CRUD
├── middleware/
│ └── authMiddleware.js # JWT authentication middleware
├── models/
│ ├── Blog.js # Blog post schema
│ ├── Comment.js # Comment schema
│ └── User.js # User schema
├── routes/
│ ├── authRoutes.js # Authentication routes
│ ├── blogRoutes.js # Blog post routes
│ └── commentRoutes.js # Comment routes
├── .env # Environment variables
├── package.json # Project dependencies and scripts
├── server.js # Main server file
└── README.md # Project documentation

Technologies

Backend:
Node.js
Express
MongoDB with Mongoose
JSON Web Tokens (JWT) for authentication

Dependencies:
express, mongoose, cors, dotenv, and others (see package.json)

Frontend (planned):
To be implemented with a framework like React or Vue for a responsive UI.
Rich text editor (e.g., Quill, CKEditor) for blog content.

Testing

Use tools like Postman or cURL to test API endpoints.
Example requests:
Create a post:curl -X POST http://localhost:5000/api/blogs \
 -H "Authorization: Bearer <your_jwt_token>" \
 -H "Content-Type: application/json" \
 -d '{"title":"My Post","content":"Hello, world!","coverImage":""}'

Like a post:curl -X POST http://localhost:5000/api/blogs/<post_id>/like \
 -H "Authorization: Bearer <your_jwt_token>"

Get recent posts:curl http://localhost:5000/api/blogs/recent

Create a comment:curl -X POST http://localhost:5000/api/comments \
 -H "Authorization: Bearer <your_jwt_token>" \
 -H "Content-Type: application/json" \
 -d '{"content":"Great post!","postId":"<post_id>"}'

Notes

Ensure MongoDB is running and MONGO_URI is correctly configured in .env.
Protected endpoints (POST /api/blogs, PUT /api/blogs/:id, DELETE /api/blogs/:id, POST /api/blogs/:id/like, POST /api/comments, DELETE /api/comments/:commentId) require a valid JWT token in the Authorization header (Bearer <token>).
For existing blog posts, ensure the likes and comments fields are initialized as empty arrays (run await Blog.updateMany({}, { $set: { likes: [], comments: [] } }); if needed).
Frontend implementation is pending to provide a responsive UI and integrate with the API.
