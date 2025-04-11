import express from "express";
import { EventPartner, Event, Organization, User } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all partners
router.get("/", async (req, res) => {
  try {
    const partners = await EventPartner.findAll({
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });
    res.json(partners);
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ message: "Error fetching partners" });
  }
});

// Get single partner
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await EventPartner.findByPk(id, {
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.json(partner);
  } catch (error) {
    console.error("Error fetching partner:", error);
    res.status(500).json({ message: "Error fetching partner" });
  }
});

// Get partners for a specific event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const partners = await EventPartner.findAll({
      where: { event_id: eventId },
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ],
      order: [
        ['event_partner_tier', 'ASC'],
        [Organization, 'name', 'ASC']
      ]
    });
    res.json(partners);
  } catch (error) {
    console.error("Error fetching partners for event:", error);
    res.status(500).json({ message: "Error fetching partners for event" });
  }
});

// Create new partner
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { organization_id, event_partner_tier, event_id } = req.body;

    // Check if event exists and user has permission
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only event creator or admin can add partners
    if (event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to add partners to this event" });
    }

    // Check if organization exists
    const organization = await Organization.findByPk(organization_id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if this organization is already a partner for this event
    const existingPartner = await EventPartner.findOne({
      where: {
        event_id,
        organization_id
      }
    });

    if (existingPartner) {
      return res.status(400).json({ message: "This organization is already a partner for this event" });
    }

    const partner = await EventPartner.create({
      organization_id,
      event_partner_tier,
      event_id
    });

    const partnerWithDetails = await EventPartner.findByPk(partner.id, {
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });

    res.status(201).json(partnerWithDetails);
  } catch (error) {
    console.error("Error creating partner:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id or organization_id provided" });
    } else {
      res.status(500).json({ message: "Error creating partner" });
    }
  }
});

// Update partner
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { organization_id, event_partner_tier, event_id } = req.body;

    const partner = await EventPartner.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // Check if user has permission to update
    if (partner.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this partner" });
    }

    // If event_id is changing, verify the new event exists and user has permission
    if (event_id && event_id !== partner.event_id) {
      const newEvent = await Event.findByPk(event_id);
      if (!newEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      if (newEvent.created_by !== req.user.id && req.user.user_type !== 'admin') {
        return res.status(403).json({ message: "Not authorized to move partner to this event" });
      }
    }

    // If organization_id is changing, verify it exists
    if (organization_id && organization_id !== partner.organization_id) {
      const organization = await Organization.findByPk(organization_id);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
    }

    await partner.update({
      organization_id,
      event_partner_tier,
      event_id
    });

    const updatedPartner = await EventPartner.findByPk(id, {
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });

    res.json(updatedPartner);
  } catch (error) {
    console.error("Error updating partner:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id or organization_id provided" });
    } else {
      res.status(500).json({ message: "Error updating partner" });
    }
  }
});

// Delete partner
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await EventPartner.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // Check if user has permission to delete
    if (partner.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this partner" });
    }

    await partner.destroy();
    res.json({ message: "Partner deleted successfully" });
  } catch (error) {
    console.error("Error deleting partner:", error);
    res.status(500).json({ message: "Error deleting partner" });
  }
});

export default router;
