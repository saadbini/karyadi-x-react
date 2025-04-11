import express from "express";
import { EventCollaborator, Event, Organization, User } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all collaborators
router.get("/", async (req, res) => {
  try {
    const collaborators = await EventCollaborator.findAll({
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });
    res.json(collaborators);
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    res.status(500).json({ message: "Error fetching collaborators" });
  }
});

// Get single collaborator
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const collaborator = await EventCollaborator.findByPk(id, {
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });

    if (!collaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    res.json(collaborator);
  } catch (error) {
    console.error("Error fetching collaborator:", error);
    res.status(500).json({ message: "Error fetching collaborator" });
  }
});

// Get collaborators for a specific event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const collaborators = await EventCollaborator.findAll({
      where: { event_id: eventId },
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ],
      order: [
        ['event_collaborator_type', 'ASC'],
        [Organization, 'name', 'ASC']
      ]
    });
    res.json(collaborators);
  } catch (error) {
    console.error("Error fetching collaborators for event:", error);
    res.status(500).json({ message: "Error fetching collaborators for event" });
  }
});

// Create new collaborator
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { organization_id, event_collaborator_type, event_id } = req.body;

    // Check if event exists and user has permission
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only event creator or admin can add collaborators
    if (event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to add collaborators to this event" });
    }

    // Check if organization exists
    const organization = await Organization.findByPk(organization_id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if this organization is already a collaborator for this event
    const existingCollaborator = await EventCollaborator.findOne({
      where: {
        event_id,
        organization_id
      }
    });

    if (existingCollaborator) {
      return res.status(400).json({ message: "This organization is already a collaborator for this event" });
    }

    const collaborator = await EventCollaborator.create({
      organization_id,
      event_collaborator_type,
      event_id
    });

    const collaboratorWithDetails = await EventCollaborator.findByPk(collaborator.id, {
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });

    res.status(201).json(collaboratorWithDetails);
  } catch (error) {
    console.error("Error creating collaborator:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id or organization_id provided" });
    } else {
      res.status(500).json({ message: "Error creating collaborator" });
    }
  }
});

// Update collaborator
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { organization_id, event_collaborator_type, event_id } = req.body;

    const collaborator = await EventCollaborator.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!collaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    // Check if user has permission to update
    if (collaborator.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this collaborator" });
    }

    // If event_id is changing, verify the new event exists and user has permission
    if (event_id && event_id !== collaborator.event_id) {
      const newEvent = await Event.findByPk(event_id);
      if (!newEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      if (newEvent.created_by !== req.user.id && req.user.user_type !== 'admin') {
        return res.status(403).json({ message: "Not authorized to move collaborator to this event" });
      }
    }

    // If organization_id is changing, verify it exists
    if (organization_id && organization_id !== collaborator.organization_id) {
      const organization = await Organization.findByPk(organization_id);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
    }

    await collaborator.update({
      organization_id,
      event_collaborator_type,
      event_id
    });

    const updatedCollaborator = await EventCollaborator.findByPk(id, {
      include: [
        {
          model: Organization,
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        },
        { model: Event }
      ]
    });

    res.json(updatedCollaborator);
  } catch (error) {
    console.error("Error updating collaborator:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid event_id or organization_id provided" });
    } else {
      res.status(500).json({ message: "Error updating collaborator" });
    }
  }
});

// Delete collaborator
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const collaborator = await EventCollaborator.findByPk(id, {
      include: [{ model: Event }]
    });

    if (!collaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    // Check if user has permission to delete
    if (collaborator.Event.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this collaborator" });
    }

    await collaborator.destroy();
    res.json({ message: "Collaborator deleted successfully" });
  } catch (error) {
    console.error("Error deleting collaborator:", error);
    res.status(500).json({ message: "Error deleting collaborator" });
  }
});

export default router;
