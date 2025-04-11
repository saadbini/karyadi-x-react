import express from "express";
import { Event, User } from "../models/index.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

const checkEventOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userType = req.user.user_type;

    if (userType === "admin") {
      return next(); // Admins can edit all events
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.created_by !== userId) {
      return res.status(403).json({ message: "You do not have permission to edit this event" });
    }

    next();
  } catch (error) {
    console.error("Error checking event ownership:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Public routes
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [
        ['start_date', 'ASC'],
        ['start_time', 'ASC']
      ],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
});

// Protected routes - only admin and company can access
router.post("/", authenticateToken, authorizeRoles("admin", "company"), async (req, res) => {
  try {
    const {
      name,
      details,
      event_type,
      event_status,
      image,
      start_time,
      end_time,
      start_date,
      end_date,
      location_url,
      slots,
      virtual_link,
    } = req.body;

    const imageUrl = image || "https://fastly.picsum.photos/id/119/5000/3333.jpg?hmac=-P7a8jMY8U0ZGUn7chfRQloInhMTymeeuRo5smXVtg8";

    const newEvent = await Event.create({
      name,
      details,
      event_type,
      event_status,
      image: imageUrl,
      start_time,
      end_time,
      start_date,
      end_date,
      location_url,
      slots,
      virtual_link,
      created_by: req.user.id // Add the creator's ID
    });

    const eventWithCreator = await Event.findByPk(newEvent.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json(eventWithCreator);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event" });
  }
});

router.put("/:id", authenticateToken, authorizeRoles("admin", "company"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      details,
      event_type,
      event_status,
      image,
      start_time,
      end_time,
      start_date,
      end_date,
      location_url,
      slots,
      virtual_link
    } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const imageUrl = image || event.image || "https://fastly.picsum.photos/id/119/5000/3333.jpg?hmac=-P7a8jMY8U0ZGUn7chfRQloInhMTymeeuRo5smXVtg8";

    const updatedEvent = await event.update({
      name,
      details,
      event_type,
      event_status,
      image: imageUrl,
      start_time,
      end_time,
      start_date,
      end_date,
      location_url,
      slots,
      virtual_link,
    });

    const eventWithCreator = await Event.findByPk(updatedEvent.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json(eventWithCreator);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Error updating event" });
  }
});

router.delete("/:id", authenticateToken, authorizeRoles("admin", "company"), async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.destroy();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
});

// Update slots only (public route)
router.patch("/:id/slots", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { slots } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedEvent = await event.update({
      slots,
    });

    const eventWithCreator = await Event.findByPk(updatedEvent.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json(eventWithCreator);
  } catch (error) {
    console.error("Error updating event slots:", error);
    res.status(500).json({ message: "Error updating event slots" });
  }
});

export default router;
