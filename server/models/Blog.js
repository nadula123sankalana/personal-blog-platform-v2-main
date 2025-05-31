import mongoose from "mongoose";







const blogSchema = new mongoose.Schema({



  title: { type: String, required: true },



  content: { type: String, required: true },



  coverImage: { type: String, default: "" },



  author: {



    type: mongoose.Schema.Types.ObjectId,



    ref: "User",



    required: true,



  },



  likes: [



    {



      type: mongoose.Schema.Types.ObjectId,



      ref: "User",



    },



  ],



  comments: [



    {



      type: mongoose.Schema.Types.ObjectId,



      ref: "Comment",



    },



  ],



}, { timestamps: true });







// Set default empty arrays for likes and comments at the schema level:



blogSchema.path('likes').default(() => []);



blogSchema.path('comments').default(() => []);







const Blog = mongoose.model("Blog", blogSchema);







export default Blog;