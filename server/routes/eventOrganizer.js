import express from "express";
import { EventOrganizer, Event, Organization, User } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all event organizers
router.get("/", async (req, res) => {
  try {
    const eventOrganizers = await EventOrganizer.findAll({
      include: [
        {
          model: Organization,
          attributes: ['id', 'name', 'logo', 'website_url', 'industry_category'],
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        {
          model: Event,
          attributes: ['id', 'name', 'event_type', 'event_status']
        }
      ]
    });
    res.json(eventOrganizers);
  } catch (error) {
    console.error("Error fetching event organizers:", error);
    res.status(500).json({ message: "Error fetching event organizers" });
  }
});

// Get single event organizer
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eventOrganizer = await EventOrganizer.findByPk(id, {
      include: [
        {
          model: Organization,
          attributes: ['id', 'name', 'logo', 'website_url', 'industry_category'],
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        {
          model: Event,
          attributes: ['id', 'name', 'event_type', 'event_status']
        }
      ]
    });

    if (!eventOrganizer) {
      return res.status(404).json({ message: "Event organizer not found" });
    }

    res.json(eventOrganizer);
  } catch (error) {
    console.error("Error fetching event organizer:", error);
    res.status(500).json({ message: "Error fetching event organizer" });
  }
});

// Get organizers for a specific event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventOrganizers = await EventOrganizer.findAll({
      where: { event_id: eventId },
      include: [
        {
          model: Organization,
          attributes: ['id', 'name', 'logo', 'website_url', 'industry_category'],
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        }
      ],
      order: [
        ['is_main_organizer', 'DESC'],
        [Organization, 'name', 'ASC']
      ]
    });
    // console.log("Event Organizers: ", eventOrganizers, "\n");
    res.json(eventOrganizers);
  } catch (error) {
    console.error("Error fetching organizers for event:", error);
    res.status(500).json({ message: "Error fetching organizers for event" });
  }
});

// Create new event organizer
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { organizer_id, is_main_organizer, event_id } = req.body;

    // Check if event exists and user has permission
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only event creator or admin can add organizers
    if (event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to add organizers to this event" });
    }

    // Check if organization exists
    const organization = await Organization.findByPk(organizer_id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if this organization is already an organizer for this event
    const existingOrganizer = await EventOrganizer.findOne({
      where: {
        event_id,
        organizer_id
      }
    });

    if (existingOrganizer) {
      return res.status(400).json({ message: "This organization is already an organizer for this event" });
    }

    const eventOrganizer = await EventOrganizer.create({
      organizer_id,
      is_main_organizer,
      event_id
    });

    const eventOrganizerWithDetails = await EventOrganizer.findByPk(eventOrganizer.id, {
      include: [
        {
          model: Organization,
          attributes: ['id', 'name', 'logo', 'website_url', 'industry_category'],
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        {
          model: Event,
          attributes: ['id', 'name', 'event_type', 'event_status']
        }
      ]
    });

    res.status(201).json(eventOrganizerWithDetails);
  } catch (error) {
    console.error("Error creating event organizer:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id or organizer_id provided" });
    } else {
      res.status(500).json({ message: "Error creating event organizer" });
    }
  }
});

// Update event organizer
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_main_organizer } = req.body;

    const eventOrganizer = await EventOrganizer.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!eventOrganizer) {
      return res.status(404).json({ message: "Event organizer not found" });
    }

    // Check if user has permission to update
    if (eventOrganizer.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this event organizer" });
    }

    await eventOrganizer.update({ is_main_organizer });

    const updatedEventOrganizer = await EventOrganizer.findByPk(id, {
      include: [
        {
          model: Organization,
          attributes: ['id', 'name', 'logo', 'website_url', 'industry_category'],
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        {
          model: Event,
          attributes: ['id', 'name', 'event_type', 'event_status']
        }
      ]
    });

    res.json(updatedEventOrganizer);
  } catch (error) {
    console.error("Error updating event organizer:", error);
    res.status(500).json({ message: "Error updating event organizer" });
  }
});

// Delete event organizer
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const eventOrganizer = await EventOrganizer.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!eventOrganizer) {
      return res.status(404).json({ message: "Event organizer not found" });
    }

    // Check if user has permission to delete
    if (eventOrganizer.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this event organizer" });
    }

    await eventOrganizer.destroy();
    res.json({ message: "Event organizer deleted successfully" });
  } catch (error) {
    console.error("Error deleting event organizer:", error);
    res.status(500).json({ message: "Error deleting event organizer" });
  }
});

export default router;
