import User from "../models/User.js";
import RemovedUser from "../models/RemovedUser.js";

// Get all users (active only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -emailVerificationToken")
      .sort({ createdAt: -1 });

    res.status(200).json({
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all removed/deleted users (archive)
export const getRemovedUsers = async (req, res) => {
  try {
    const removedUsers = await RemovedUser.find()
      .populate("deletedBy", "name email")
      .sort({ deletedAt: -1 });

    res.status(200).json({
      removedUsers,
      count: removedUsers.length,
    });
  } catch (error) {
    console.error("Get removed users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Soft delete user (Fire/Remove user)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user._id; // From auth middleware

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting yourself
    if (user._id.toString() === adminId.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    // Prevent deleting other admins (only super admin should do this)
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users through this endpoint" });
    }

    // Create entry in RemovedUser collection
    const removedUser = new RemovedUser({
      originalUserId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      managerId: user.managerId,
      deletedAt: new Date(),
      deletedBy: adminId,
      deletionReason: reason || "No reason provided",
      originalCreatedAt: user.createdAt,
      wasEmailVerified: user.isEmailVerified,
    });

    await removedUser.save();

    // Delete user from User collection
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: `User ${user.name} has been removed and archived`,
      removedUser: {
        _id: removedUser._id,
        name: removedUser.name,
        email: removedUser.email,
        role: removedUser.role,
        deletedAt: removedUser.deletedAt,
        deletionReason: removedUser.deletionReason,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Restore deleted user (Rehire)
export const restoreUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find in RemovedUser collection
    const removedUser = await RemovedUser.findById(userId);
    if (!removedUser) {
      return res.status(404).json({ message: "Removed user not found" });
    }

    // Check if email already exists in active users
    const existingUser = await User.findOne({ email: removedUser.email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "Cannot restore: A user with this email already exists in active users" 
      });
    }

    // Create user back in User collection
    const restoredUser = new User({
      name: removedUser.name,
      email: removedUser.email,
      password: "$2a$10$defaultPasswordHash", // You may want to require password reset
      role: removedUser.role,
      managerId: removedUser.managerId,
      isEmailVerified: removedUser.wasEmailVerified,
      createdAt: removedUser.originalCreatedAt || new Date(),
    });

    await restoredUser.save();

    // Remove from RemovedUser collection
    await RemovedUser.findByIdAndDelete(userId);

    res.status(200).json({
      message: `User ${restoredUser.name} has been restored. Please reset their password.`,
      user: {
        _id: restoredUser._id,
        name: restoredUser.name,
        email: restoredUser.email,
        role: restoredUser.role,
      },
    });
  } catch (error) {
    console.error("Restore user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Permanently delete user (DANGER - cannot be undone)
export const permanentlyDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    // Find in RemovedUser collection
    const removedUser = await RemovedUser.findById(userId);
    if (!removedUser) {
      return res.status(404).json({ message: "Removed user not found" });
    }

    // Prevent deleting yourself (check original user ID)
    if (removedUser.originalUserId.toString() === adminId.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    // Prevent deleting admins
    if (removedUser.role === "admin") {
      return res.status(403).json({ message: "Cannot permanently delete admin users" });
    }

    // PERMANENT DELETE from RemovedUser collection (no going back!)
    await RemovedUser.findByIdAndDelete(userId);

    res.status(200).json({
      message: `User ${removedUser.name} has been permanently deleted from archive`,
    });
  } catch (error) {
    console.error("Permanent delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role (promote/demote)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const adminId = req.user._id;

    // Validate role
    if (!["user", "manager"].includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role. Only 'user' or 'manager' roles can be assigned." 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent changing your own role
    if (user._id.toString() === adminId.toString()) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    // Prevent changing admin roles
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot change admin user roles" });
    }

    // Check if deleted
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    res.status(200).json({
      message: `User ${user.name} role updated from ${oldRole} to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
