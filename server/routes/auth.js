import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserProfile } from "../models/index.js";
import { sendPasswordResetEmail } from "../utils/email.js";
import sequelize from "../db/config.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNumber, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email address already registered",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
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
          phone_number: phoneNumber,
          user_type: userType,
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

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists using Sequelize
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.user_type,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Still return success to prevent email enumeration
      return res.status(200).json({ message: "Password reset email sent" });
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update the user's password using Sequelize
    await user.update({ password: hashedPassword });

    // Send the password reset email
    await sendPasswordResetEmail(email, tempPassword);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ message: "Error sending password reset email" });
  }
});

// Verify token and return fresh user data
router.get("/verify-token", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'user_type'] 
    });
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
