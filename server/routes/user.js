import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserProfile } from "../models/index.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Get all users (admin only)
router.get("/", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get user by ID (admin or same user only)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin or requesting their own data
    if (req.user.userType !== "admin" && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "You do not have permission to access this data" });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Create new user
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, email, password, phone_number, user_type } = req.body;

    // Check if the authenticated user is an admin
    if (req.user.user_type !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email address already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user using Sequelize transaction
    const result = await sequelize.transaction(async (t) => {
      // Create user
      const newUser = await User.create(
        {
          name,
          email,
          password: hashedPassword,
          phone_number,
          user_type,
        },
        { transaction: t }
      );

      // Create user profile
      await UserProfile.create(
        {
          display_name: name,
          user_id: newUser.id,
        },
        { transaction: t }
      );

      return newUser;
    });

    // Create token
    const token = jwt.sign(
      { id: result.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        userType: result.user_type,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: "Email address already registered" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

// Update user (admin or same user only)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin or updating their own data
    if (req.user.userType !== "admin" && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "You do not have permission to update this user" });
    }

    // Prevent non-admins from changing userType
    if (req.user.userType !== "admin" && req.body.userType) {
      delete req.body.userType;
    }

    const { name, email, password, phone_number, user_type } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash password if it is provided
    let hashedPassword = password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.update({
      name,
      email,
      password: hashedPassword,
      phone_number,
      user_type,
    });

    // Create token
    const token = jwt.sign(
      { id: updatedUser.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        userType: updatedUser.user_type,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: "Email address already taken" });
    } else {
      res.status(500).json({ message: "Error updating user" });
    }
  }
});

// Delete user (admin only)
router.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;
