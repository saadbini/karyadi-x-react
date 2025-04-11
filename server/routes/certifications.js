import express from "express";
import { Certification, User } from "../models/index.js";
import { Op } from "sequelize";
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all certifications (typically for admin use)
router.get("/", async (req, res) => {
  try {
    const certifications = await Certification.findAll({
      include: [{ model: User, attributes: ["name", "email"] }],
    });
    res.json(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    res.status(500).json({ message: "Error fetching certifications" });
  }
});

// Admin: Get certifications by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const certifications = await Certification.findAll({ where: { user_id: userId } });

    res.json(certifications);
  } catch (error) {
    console.error("Error fetching certifications for user:", error);
    res.status(500).json({ message: "Error fetching certifications for user" });
  }
});

// User: Get own certifications
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const certifications = await Certification.findAll({
      where: { user_id: req.user.id },
    });

    res.json(certifications);
  } catch (error) {
    console.error("Error fetching user's certifications:", error);
    res.status(500).json({ message: "Server error fetching certifications" });
  }
});

// Get certification by ID
router.get("/:id", async (req, res) => {
  try {
    const certification = await Certification.findByPk(req.params.id);

    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    res.json(certification);
  } catch (error) {
    console.error("Error fetching certification:", error);
    res.status(500).json({ message: "Error fetching certification" });
  }
});

// Create certification
router.post("/", async (req, res) => {
  try {
    const cert = await Certification.create(req.body);
    res.status(201).json(cert);
  } catch (error) {
    console.error("Error creating certification:", error);
    res.status(500).json({ message: "Error creating certification" });
  }
});

// Update certification
router.put("/:id", async (req, res) => {
  try {
    const cert = await Certification.findByPk(req.params.id);

    if (!cert) {
      return res.status(404).json({ message: "Certification not found" });
    }

    await cert.update(req.body);
    res.json(cert);
  } catch (error) {
    console.error("Error updating certification:", error);
    res.status(500).json({ message: "Error updating certification" });
  }
});

// Delete certification
router.delete("/:id", async (req, res) => {
  try {
    const cert = await Certification.findByPk(req.params.id);

    if (!cert) {
      return res.status(404).json({ message: "Certification not found" });
    }

    await cert.destroy();
    res.json({ message: "Certification deleted successfully" });
  } catch (error) {
    console.error("Error deleting certification:", error);
    res.status(500).json({ message: "Error deleting certification" });
  }
});

// GET certification name suggestions
router.get("/suggestions/names", async (req, res) => {
  try {
    const { query } = req.query;
    const suggestions = await Certification.findAll({
      attributes: ["certification_name"],
      where: { certification_name: { [Op.iLike]: `%${query}%` } },
      group: ["certification_name"],
      limit: 5,
    });
    res.json(suggestions.map((s) => s.certification_name));
  } catch (error) {
    console.error("Error fetching name suggestions:", error);
    res.status(500).json({ message: "Error fetching suggestions" });
  }
});

// GET issuer suggestions
router.get("/suggestions/issuers", async (req, res) => {
  try {
    const { query } = req.query;
    const suggestions = await Certification.findAll({
      attributes: ["issuing_organization"],
      where: { issuing_organization: { [Op.iLike]: `%${query}%` } },
      group: ["issuing_organization"],
      limit: 5,
    });
    res.json(suggestions.map((s) => s.issuing_organization));
  } catch (error) {
    console.error("Error fetching issuer suggestions:", error);
    res.status(500).json({ message: "Error fetching suggestions" });
  }
});

export default router;
