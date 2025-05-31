import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update user profile (username and avatar)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    const { username } = req.body;

    const updateData = {};

    if (username) {
      updateData.username = username;
    }

    // Handle avatar file if uploaded
    if (req.file) {
      // Ensure uploads directory exists
      const uploadsDir = path.resolve("uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      // Save file with unique name
      const filename = `${Date.now()}_${req.file.originalname}`;
      const filepath = path.join(uploadsDir, filename);

      // Write file buffer to disk
      fs.writeFileSync(filepath, req.file.buffer);

      // Set avatar path accessible via server
      updateData.avatar = `/uploads/${filename}`;
    }

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with updated user data
    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
