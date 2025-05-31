import User from "../models/User.js";
import path from "path";
import fs from "fs";

// Update user profile (username and avatar)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;
    let avatarPath;

    if (req.file) {
      // If an avatar file is uploaded, save its path
      avatarPath = `/uploads/avatars/${req.file.filename}`;

      // Optional: Delete old avatar file if exists and is not default
      const user = await User.findById(userId);
      if (user.avatar && user.avatar !== "" && user.avatar !== avatarPath) {
        const oldAvatarPath = path.join(process.cwd(), "public", user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
    }

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username,
        ...(avatarPath && { avatar: avatarPath }),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
