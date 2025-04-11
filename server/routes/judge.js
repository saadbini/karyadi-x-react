import express from "express";
import { Judge, Event, Agenda } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all judges
router.get("/", async (req, res) => {
  try {
    const judges = await Judge.findAll({
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });
    res.json(judges);
  } catch (error) {
    console.error("Error fetching judges:", error);
    res.status(500).json({ message: "Error fetching judges" });
  }
});

// Get single judge
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const judge = await Judge.findByPk(id, {
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });

    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    res.json(judge);
  } catch (error) {
    console.error("Error fetching judge:", error);
    res.status(500).json({ message: "Error fetching judge" });
  }
});

// Get judges by agenda_id
router.get("/agenda/:agendaId", async (req, res) => {
  try {
    const { agendaId } = req.params;
    const judges = await Judge.findAll({
      where: { agenda_id: agendaId },
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });
    res.json(judges);
  } catch (error) {
    console.error("Error fetching judges by agenda_id:", error);
    res.status(500).json({ message: "Error fetching judges by agenda_id" });
  }
});

// Get judges by event_id
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const judges = await Judge.findAll({
      where: { event_id: eventId },
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });
    res.json(judges);
  } catch (error) {
    console.error("Error fetching judges by event_id:", error);
    res.status(500).json({ message: "Error fetching judges by event_id" });
  }
});

// Create new judge
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, designation, description, agenda_id, event_id, image } = req.body;

    // Verify that the event exists if event_id is provided
    if (event_id) {
      const event = await Event.findByPk(event_id);
      if (!event) {
        return res.status(400).json({ message: "Event not found" });
      }
      // Check if user has permission to add judges to this event
      if (event.created_by !== req.user.id && req.user.user_type !== 'admin') {
        return res.status(403).json({ message: "Not authorized to add judges to this event" });
      }
    }

    // Verify that the agenda exists if agenda_id is provided
    if (agenda_id) {
      const agenda = await Agenda.findByPk(agenda_id);
      if (!agenda) {
        return res.status(400).json({ message: "Agenda not found" });
      }
    }

    const judge = await Judge.create({
      name,
      designation,
      description,
      agenda_id,
      event_id,
      image
    });

    const judgeWithDetails = await Judge.findByPk(judge.id, {
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });

    res.status(201).json(judgeWithDetails);
  } catch (error) {
    console.error("Error creating judge:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id or agenda_id provided" });
    } else {
      res.status(500).json({ message: "Error creating judge" });
    }
  }
});

// Update judge
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, description, agenda_id, event_id, image } = req.body;

    const judge = await Judge.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    // Check if user has permission to update this judge
    if (judge.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this judge" });
    }

    // Verify that the event exists if event_id is provided
    if (event_id && event_id !== judge.event_id) {
      const event = await Event.findByPk(event_id);
      if (!event) {
        return res.status(400).json({ message: "Event not found" });
      }
      // Check if user has permission for the new event
      if (event.created_by !== req.user.id && req.user.user_type !== 'admin') {
        return res.status(403).json({ message: "Not authorized to move judge to this event" });
      }
    }

    // Verify that the agenda exists if agenda_id is provided
    if (agenda_id && agenda_id !== judge.agenda_id) {
      const agenda = await Agenda.findByPk(agenda_id);
      if (!agenda) {
        return res.status(400).json({ message: "Agenda not found" });
      }
    }

    await judge.update({
      name,
      designation,
      description,
      agenda_id,
      event_id,
      image
    });

    const updatedJudge = await Judge.findByPk(id, {
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });

    res.json(updatedJudge);
  } catch (error) {
    console.error("Error updating judge:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id or agenda_id provided" });
    } else {
      res.status(500).json({ message: "Error updating judge" });
    }
  }
});

// Delete judge
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const judge = await Judge.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    // Check if user has permission to delete this judge
    if (judge.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this judge" });
    }

    await judge.destroy();
    res.json({ message: "Judge deleted successfully" });
  } catch (error) {
    console.error("Error deleting judge:", error);
    res.status(500).json({ message: "Error deleting judge" });
  }
});

export default router;
