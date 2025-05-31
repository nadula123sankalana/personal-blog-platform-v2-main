import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../services/api";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import CodeBlock from "@tiptap/extension-code-block";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Save, Trash2, Type, Italic, List, ListOrdered, Code, Image as ImageIcon, Palette } from "lucide-react";

const CreateEditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2] }),
      CodeBlock,
      TextStyle,
      Color,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Load existing blog if editing
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      getBlogById(id)
        .then((res) => {
          setTitle(res.data.title || "");
          setContent(res.data.content || "");
          if (editor) editor.commands.setContent(res.data.content || "");
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load blog data");
          setLoading(false);
        });
    }
  }, [id, isEditMode, editor]);

  // Image preview
  useEffect(() => {
    if (coverImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(coverImage);
    } else {
      setPreview(null);
    }
  }, [coverImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!title || !content) {
      setError("Title and content are required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      if (isEditMode) {
        await updateBlog(id, formData);
        setSuccess("Blog updated successfully!");
      } else {
        await createBlog(formData);
        setSuccess("Blog created successfully!");
      }

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;

    setError("");
    setLoading(true);
    try {
      await deleteBlog(id);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to delete blog");
      setLoading(false);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  // Default color options
  const colorOptions = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Edit Blog" : "Create Blog"}
      </h2>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-3 rounded-lg mb-4">{success}</p>}

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter blog title"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Cover Image (optional)
            </label>
            <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <ImageIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">
                {coverImage ? coverImage.name : "Upload an image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="hidden"
              />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-full max-w-md h-48 object-cover rounded-lg shadow-md"
              />
            )}
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>

            {/* Tiptap Toolbar */}
            {editor && (
              <div className="flex flex-wrap gap-2 mb-3 p-2 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded-lg hover:bg-gray-600 transition-colors ${
                    editor.isActive("bold") ? "bg-gray-700" : "bg-gray-900"
                  }`}
                  title="Bold"
                >
                  <Type className="w-5 h-5 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded-lg hover:bg-gray-600 transition-colors ${
                    editor.isActive("italic") ? "bg-gray-700" : "bg-gray-900"
                  }`}
                  title="Italic"
                >
                  <Italic className="w-5 h-5 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-2 rounded-lg hover:bg-gray-600 transition-colors ${
                    editor.isActive("heading", { level: 1 }) ? "bg-gray-700" : "bg-gray-900"
                  }`}
                  title="Heading 1"
                >
                  <span className="text-white font-semibold">H1</span>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded-lg hover:bg-gray-600 transition-colors ${
                    editor.isActive("heading", { level: 2 }) ? "bg-gray-700" : "bg-gray-900"
                  }`}
                  title="Heading 2"
                >
                  <span className="text-white font-semibold">H2</span>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded-lg hover:bg-gray-600 transition-colors ${
                    editor.isActive("bulletList") ? "bg-gray-700" : "bg-gray-900"
                  }`}
                  title="Bullet List"
                >
                  <List className="w-5 h-5 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded-lg hover:bg-gray-600 transition-colors ${
                    editor.isActive("orderedList") ? "bg-gray-700" : "bg-gray-900"
                  }`}
                  title="Numbered List"
                >
                  <ListOrdered className="w-5 h-5 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={`p-2 rounded-lg hover:bg-gray-600 transition-colors ${
                    editor.isActive("codeBlock") ? "bg-gray-700" : "bg-gray-900"
                  }`}
                  title="Code Block"
                >
                  <Code className="w-5 h-5 text-white" />
                </button>

                {/* Color Picker Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleColorPicker}
                    className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-600 transition-colors ${
                      showColorPicker ? "bg-gray-700" : "bg-gray-900"
                    }`}
                    title="Text Color"
                  >
                    <Palette className="w-5 h-5 text-white" />
                    <span
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: selectedColor }}
                    ></span>
                  </button>

                  {showColorPicker && (
                    <div className="absolute z-10 mt-2 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                      <div className="grid grid-cols-5 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className="w-6 h-6 rounded-full border border-gray-500 hover:border-gray-300 transition-colors"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            title={color}
                          />
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="w-8 h-8 cursor-pointer"
                        />
                        <span className="text-xs text-gray-300">{selectedColor}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Editor Content */}
            <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] bg-white">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <Save className="w-5 h-5 text-white" />
              {isEditMode ? "Update Blog" : "Create Blog"}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                <Trash2 className="w-5 h-5 text-white" />
                Delete Blog
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateEditBlog;