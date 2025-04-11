import express from "express";
import { Organization, User, JobPost, Event } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all organizations - no auth required
router.get("/", async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: JobPost },
        { 
          model: Event,
          through: 'event_organizer',
          as: 'organizedEvents'
        }
      ]
    });
    res.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ message: "Error fetching organizations" });
  }
});

// Get single organization
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: JobPost },
        { 
          model: Event,
          through: 'event_organizer',
          as: 'organizedEvents'
        }
      ]
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ message: "Error fetching organization" });
  }
});

// Create new organization
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      name,
      organization_description,
      logo,
      no_of_employees,
      website_url,
      industry_category
    } = req.body;

    const organization = await Organization.create({
      name,
      organization_description,
      logo,
      no_of_employees,
      website_url,
      industry_category,
      created_by: req.user.id
    });

    const organizationWithDetails = await Organization.findByPk(organization.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json(organizationWithDetails);
  } catch (error) {
    console.error("Error creating organization:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: "Organization name must be unique" });
    } else {
      res.status(500).json({ message: "Error creating organization" });
    }
  }
});

// Update organization
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      organization_description,
      logo,
      no_of_employees,
      website_url,
      industry_category
    } = req.body;

    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if user has permission to update
    if (organization.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this organization" });
    }

    await organization.update({
      name,
      organization_description,
      logo,
      no_of_employees,
      website_url,
      industry_category
    });

    const updatedOrganization = await Organization.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: JobPost },
        { 
          model: Event,
          through: 'event_organizer',
          as: 'organizedEvents'
        }
      ]
    });

    res.json(updatedOrganization);
  } catch (error) {
    console.error("Error updating organization:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: "Organization name must be unique" });
    } else {
      res.status(500).json({ message: "Error updating organization" });
    }
  }
});

// Delete organization
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findByPk(id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if user has permission to delete
    if (organization.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this organization" });
    }

    await organization.destroy();
    res.json({ message: "Organization deleted successfully" });
  } catch (error) {
    console.error("Error deleting organization:", error);
    res.status(500).json({ message: "Error deleting organization" });
  }
});

// Get organizations created by a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const organizations = await Organization.findAll({
      where: { created_by: userId },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: JobPost },
        { 
          model: Event,
          through: 'event_organizer',
          as: 'organizedEvents'
        }
      ]
    });
    res.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations by user:", error);
    res.status(500).json({ message: "Error fetching organizations by user" });
  }
});

export default router;
