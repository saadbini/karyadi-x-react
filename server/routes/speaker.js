import express from "express";
import { Speaker, Event, Agenda } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all speakers
router.get("/", async (req, res) => {
  try {
    const speakers = await Speaker.findAll({
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });
    res.json(speakers);
  } catch (error) {
    console.error("Error fetching speakers:", error);
    res.status(500).json({ message: "Error fetching speakers" });
  }
});

// Get single speaker
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const speaker = await Speaker.findByPk(id, {
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });

    if (!speaker) {
      return res.status(404).json({ message: "Speaker not found" });
    }

    res.json(speaker);
  } catch (error) {
    console.error("Error fetching speaker:", error);
    res.status(500).json({ message: "Error fetching speaker" });
  }
});

// Get speakers by agenda_id
router.get("/agenda/:agendaId", async (req, res) => {
  try {
    const { agendaId } = req.params;
    const speakers = await Speaker.findAll({
      where: { agenda_id: agendaId },
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });
    res.json(speakers);
  } catch (error) {
    console.error("Error fetching speakers by agenda_id:", error);
    res.status(500).json({ message: "Error fetching speakers by agenda_id" });
  }
});

// Get speakers by event_id
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const speakers = await Speaker.findAll({
      where: { event_id: eventId },
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });
    res.json(speakers);
  } catch (error) {
    console.error("Error fetching speakers by event_id:", error);
    res.status(500).json({ message: "Error fetching speakers by event_id" });
  }
});

// Create new speaker
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, designation, description, agenda_id, event_id, image } = req.body;

    // Verify that the event exists if event_id is provided
    if (event_id) {
      const event = await Event.findByPk(event_id);
      if (!event) {
        return res.status(400).json({ message: "Event not found" });
      }
    }

    // Verify that the agenda exists if agenda_id is provided
    if (agenda_id) {
      const agenda = await Agenda.findByPk(agenda_id);
      if (!agenda) {
        return res.status(400).json({ message: "Agenda not found" });
      }
    }

    const speaker = await Speaker.create({
      name,
      designation,
      description,
      agenda_id,
      event_id,
      image
    });

    const speakerWithDetails = await Speaker.findByPk(speaker.id, {
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });

    res.status(201).json(speakerWithDetails);
  } catch (error) {
    console.error("Error creating speaker:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id or agenda_id provided" });
    } else {
      res.status(500).json({ message: "Error creating speaker" });
    }
  }
});

// Update speaker
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, description, agenda_id, event_id, image } = req.body;

    const speaker = await Speaker.findByPk(id);
    if (!speaker) {
      return res.status(404).json({ message: "Speaker not found" });
    }

    // Verify that the event exists if event_id is provided
    if (event_id) {
      const event = await Event.findByPk(event_id);
      if (!event) {
        return res.status(400).json({ message: "Event not found" });
      }
    }

    // Verify that the agenda exists if agenda_id is provided
    if (agenda_id) {
      const agenda = await Agenda.findByPk(agenda_id);
      if (!agenda) {
        return res.status(400).json({ message: "Agenda not found" });
      }
    }

    await speaker.update({
      name,
      designation,
      description,
      agenda_id,
      event_id,
      image
    });

    const updatedSpeaker = await Speaker.findByPk(id, {
      include: [
        { model: Event },
        { model: Agenda }
      ]
    });

    res.json(updatedSpeaker);
  } catch (error) {
    console.error("Error updating speaker:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id or agenda_id provided" });
    } else {
      res.status(500).json({ message: "Error updating speaker" });
    }
  }
});

// Delete speaker
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const speaker = await Speaker.findByPk(id);

    if (!speaker) {
      return res.status(404).json({ message: "Speaker not found" });
    }

    await speaker.destroy();
    res.json({ message: "Speaker deleted successfully" });
  } catch (error) {
    console.error("Error deleting speaker:", error);
    res.status(500).json({ message: "Error deleting speaker" });
  }
});

export default router;
