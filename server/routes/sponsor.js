import express from "express";
import { EventSponsor, Event, Organization, User } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all sponsors
router.get("/", async (req, res) => {
  try {
    const sponsors = await EventSponsor.findAll({
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });
    res.json(sponsors);
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    res.status(500).json({ message: "Error fetching sponsors" });
  }
});

// Get single sponsor
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sponsor = await EventSponsor.findByPk(id, {
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    res.json(sponsor);
  } catch (error) {
    console.error("Error fetching sponsor:", error);
    res.status(500).json({ message: "Error fetching sponsor" });
  }
});

// Get sponsors for a specific event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const sponsors = await EventSponsor.findAll({
      where: { event_id: eventId },
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ],
      order: [
        ['event_sponsor_tier', 'ASC'],
        [Organization, 'name', 'ASC']
      ]
    });
    res.json(sponsors);
  } catch (error) {
    console.error("Error fetching sponsors for event:", error);
    res.status(500).json({ message: "Error fetching sponsors for event" });
  }
});

// Create new sponsor
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { organization_id, event_sponsor_tier, event_id } = req.body;

    // Check if event exists and user has permission
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only event creator or admin can add sponsors
    if (event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to add sponsors to this event" });
    }

    // Check if organization exists
    const organization = await Organization.findByPk(organization_id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if this organization is already a sponsor for this event
    const existingSponsor = await EventSponsor.findOne({
      where: {
        event_id,
        organization_id
      }
    });

    if (existingSponsor) {
      return res.status(400).json({ message: "This organization is already a sponsor for this event" });
    }

    const sponsor = await EventSponsor.create({
      organization_id,
      event_sponsor_tier,
      event_id
    });

    const sponsorWithDetails = await EventSponsor.findByPk(sponsor.id, {
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });

    res.status(201).json(sponsorWithDetails);
  } catch (error) {
    console.error("Error creating sponsor:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id or organization_id provided" });
    } else {
      res.status(500).json({ message: "Error creating sponsor" });
    }
  }
});

// Update sponsor
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { organization_id, event_sponsor_tier, event_id } = req.body;

    const sponsor = await EventSponsor.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    // Check if user has permission to update
    if (sponsor.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this sponsor" });
    }

    // If event_id is changing, verify the new event exists and user has permission
    if (event_id && event_id !== sponsor.event_id) {
      const newEvent = await Event.findByPk(event_id);
      if (!newEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      if (newEvent.created_by !== req.user.id && req.user.user_type !== 'admin') {
        return res.status(403).json({ message: "Not authorized to move sponsor to this event" });
      }
    }

    // If organization_id is changing, verify it exists
    if (organization_id && organization_id !== sponsor.organization_id) {
      const organization = await Organization.findByPk(organization_id);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
    }

    await sponsor.update({
      organization_id,
      event_sponsor_tier,
      event_id
    });

    const updatedSponsor = await EventSponsor.findByPk(id, {
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });

    res.json(updatedSponsor);
  } catch (error) {
    console.error("Error updating sponsor:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id or organization_id provided" });
    } else {
      res.status(500).json({ message: "Error updating sponsor" });
    }
  }
});

// Delete sponsor
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const sponsor = await EventSponsor.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    // Check if user has permission to delete
    if (sponsor.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this sponsor" });
    }

    await sponsor.destroy();
    res.json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    console.error("Error deleting sponsor:", error);
    res.status(500).json({ message: "Error deleting sponsor" });
  }
});

export default router;
