import express from "express";
import { Agenda, Event, Speaker } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all agendas
router.get("/", async (req, res) => {
  try {
    const agendas = await Agenda.findAll({
      include: [
        { model: Event },
        { model: Speaker }
      ],
      order: [
        ['start_time', 'ASC']
      ]
    });
    res.json(agendas);
  } catch (error) {
    console.error("Error fetching agendas:", error);
    res.status(500).json({ message: "Error fetching agendas" });
  }
});

// Get single agenda
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const agenda = await Agenda.findByPk(id, {
      include: [
        { model: Event },
        { model: Speaker }
      ]
    });

    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }

    res.json(agenda);
  } catch (error) {
    console.error("Error fetching agenda:", error);
    res.status(500).json({ message: "Error fetching agenda" });
  }
});

// Get all agendas for an event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const agendas = await Agenda.findAll({
      where: { event_id: eventId },
      include: [
        { model: Event },
        { model: Speaker }
      ],
      order: [
        ['start_time', 'ASC']
      ]
    });
    res.json(agendas);
  } catch (error) {
    console.error("Error fetching agendas:", error);
    res.status(500).json({ message: "Error fetching agendas" });
  }
});

// Create new agenda
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description, start_time, end_time, slido_url, event_id } = req.body;

    // Verify that the event exists
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(400).json({ message: "Event not found" });
    }

    // Verify that the user has permission to add agenda to this event
    if (event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to add agenda to this event" });
    }

    const agenda = await Agenda.create({
      name,
      description,
      start_time,
      end_time,
      slido_url,
      event_id
    });

    const agendaWithDetails = await Agenda.findByPk(agenda.id, {
      include: [
        { model: Event },
        { model: Speaker }
      ]
    });

    res.status(201).json(agendaWithDetails);
  } catch (error) {
    console.error("Error creating agenda:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id provided" });
    } else {
      res.status(500).json({ message: "Error creating agenda" });
    }
  }
});

// Update agenda (protected route)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, start_time, end_time, slido_url } = req.body;

    const agenda = await Agenda.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }

    // Verify that the user has permission to update this agenda
    if (agenda.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this agenda" });
    }

    await agenda.update({
      name,
      description,
      start_time,
      end_time,
      slido_url
    });

    const updatedAgenda = await Agenda.findByPk(id, {
      include: [
        { model: Event },
        { model: Speaker }
      ]
    });

    res.json(updatedAgenda);
  } catch (error) {
    console.error("Error updating agenda:", error);
    res.status(500).json({ message: "Error updating agenda" });
  }
});

// Delete agenda (protected route)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const agenda = await Agenda.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }

    // Verify that the user has permission to delete this agenda
    if (agenda.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this agenda" });
    }

    await agenda.destroy();
    res.json({ message: "Agenda deleted successfully" });
  } catch (error) {
    console.error("Error deleting agenda:", error);
    res.status(500).json({ message: "Error deleting agenda" });
  }
});

export default router;
