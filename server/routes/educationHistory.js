import express from "express";
import { Education, User } from "../models/index.js";
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Education route works!" });
});

// Get all education histories (with user info, typically admin only)
router.get("/", async (req, res) => {
  try {
    const education = await Education.findAll({
      include: [{ model: User, attributes: ["name", "email"] }],
    });
    res.json(education);
  } catch (error) {
    console.error("Error fetching education history:", error);
    res.status(500).json({ message: "Error fetching education history" });
  }
});

// Admin: Get education history by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const education = await Education.findAll({ where: { user_id: userId } });

    res.json(education);
  } catch (error) {
    console.error("Error fetching education for user:", error);
    res.status(500).json({ message: "Error fetching education for user" });
  }
});

// User: Get own education history
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const education = await Education.findAll({
      where: { user_id: req.user.id },
    });

    res.json(education);
  } catch (error) {
    console.error("Error fetching user's education history:", error);
    res.status(500).json({ message: "Server error fetching education history" });
  }
});

// Get education by education record ID
router.get("/:id", async (req, res) => {
  try {
    const education = await Education.findByPk(req.params.id);

    if (!education) {
      return res.status(404).json({ message: "Education record not found" });
    }

    res.json(education);
  } catch (error) {
    console.error("Error fetching education by ID:", error);
    res.status(500).json({ message: "Error fetching education by ID" });
  }
});

// Create new education record
router.post("/", async (req, res) => {
  try {
    const record = await Education.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    console.error("Error creating education record:", error);
    res.status(500).json({ message: "Error creating education record" });
  }
});

// Update education record
router.put("/:id", async (req, res) => {
  try {
    const record = await Education.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Education record not found" });
    }

    await record.update(req.body);
    res.json(record);
  } catch (error) {
    console.error("Error updating education record:", error);
    res.status(500).json({ message: "Error updating education record" });
  }
});

// Delete education record
router.delete("/:id", async (req, res) => {
  try {
    const record = await Education.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Education record not found" });
    }

    await record.destroy();
    res.json({ message: "Education record deleted successfully" });
  } catch (error) {
    console.error("Error deleting education record:", error);
    res.status(500).json({ message: "Error deleting education record" });
  }
});

export default router;
