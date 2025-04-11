import express from "express";
import { User, Event, Attendance } from "../models/index.js";
import { sendRSVPCancelEmail, sendRSVPConfirmationEmail } from "../utils/email.js";

const router = express.Router();

// Get all attendance
router.get("/", async (req, res) => {
  try {
    const attendances = await Attendance.findAll({
      include: [
        { model: User, attributes: ['name', 'email', 'user_type'] },
        { model: Event, attributes: ['name', 'date', 'start_time', 'end_time'] }
      ]
    });
    res.json(attendances);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Error fetching attendance" });
  }
});

// Get single Attendee by id and event id
router.get("/user/:userId/event/:eventId", async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    const parsedUserId = parseInt(userId, 10);
    const parsedEventId = parseInt(eventId, 10);

    if (isNaN(parsedUserId) || isNaN(parsedEventId)) {
      return res.status(400).json({ message: "Invalid userId or eventId" });
    }

    const attendance = await Attendance.findOne({
      where: {
        user_id: parsedUserId,
        event_id: parsedEventId
      }
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    res.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Error fetching attendance" });
  }
});

// Get attendees by event ID
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const parsedEventId = parseInt(eventId, 10);

    if (isNaN(parsedEventId)) {
      return res.status(400).json({ message: "Invalid eventId" });
    }

    const attendees = await Attendance.findAll({
      where: { event_id: parsedEventId },
      include: [
        { model: User, attributes: ['name', 'email', 'user_type'] }
      ]
    });

    res.json(attendees);
  } catch (error) {
    console.error("Error fetching attendance by event ID:", error);
    res.status(500).json({ message: "Error fetching attendance by event ID" });
  }
});

// Get events by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const attendances = await Attendance.findAll({
      where: { user_id: parsedUserId },
      include: [
        { 
          model: Event,
          attributes: ['name', 'date', 'start_time', 'end_time']
        }
      ]
    });

    res.json(attendances);
  } catch (error) {
    console.error("Error fetching attendance by user ID:", error);
    res.status(500).json({ message: "Error fetching attendance by user ID" });
  }
});

// Create new attendance
router.post("/", async (req, res) => {
  try {
    const { user_id, event_id, attendance_status } = req.body;
    const parsedUserId = parseInt(user_id, 10);
    const parsedEventId = parseInt(event_id, 10);

    if (isNaN(parsedUserId) || isNaN(parsedEventId)) {
      return res.status(400).json({ message: "Invalid user_id or event_id" });
    }

    const attendance = await Attendance.create({
      user_id: parsedUserId,
      event_id: parsedEventId,
      attendance_status
    });

    // Fetch user email and event details
    const user = await User.findByPk(parsedUserId, {
      attributes: ['email']
    });

    const event = await Event.findByPk(parsedEventId, {
      attributes: ['name', 'date', 'start_time', 'end_time']
    });

    const eventName = event.name;
    const eventDate = new Date(event.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const eventStartTime = new Date(event.start_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const eventEndTime = new Date(event.end_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Send confirmation email
    await sendRSVPConfirmationEmail(
      user.email,
      event_id,
      eventName,
      eventDate,
      `${eventStartTime} - ${eventEndTime} (${timezone})`
    );

    res.status(201).json(attendance);
  } catch (error) {
    console.error("Error creating attendance:", error);
    res.status(500).json({ message: "Error creating attendance" });
  }
});

// Update attendance
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, event_id, attendance_status } = req.body;
    const parsedUserId = parseInt(user_id, 10);
    const parsedEventId = parseInt(event_id, 10);

    if (isNaN(parsedUserId) || isNaN(parsedEventId)) {
      return res.status(400).json({ message: "Invalid user_id or event_id" });
    }

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    const updatedAttendance = await attendance.update({
      user_id: parsedUserId,
      event_id: parsedEventId,
      attendance_status
    });

    res.json(updatedAttendance);
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Error updating attendance" });
  }
});

// Delete attendance
router.delete("/:userId/:eventId", async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    const parsedUserId = parseInt(userId, 10);
    const parsedEventId = parseInt(eventId, 10);

    if (isNaN(parsedUserId) || isNaN(parsedEventId)) {
      return res.status(400).json({ message: "Invalid userId or eventId" });
    }

    const attendance = await Attendance.findOne({
      where: {
        user_id: parsedUserId,
        event_id: parsedEventId
      }
    });

    if (!attendance) {
      return res.status(404).json({ message: "RSVP not found for the given user and event" });
    }

    // Fetch user email before deleting the attendance
    const user = await User.findByPk(parsedUserId, {
      attributes: ['email']
    });

    await attendance.destroy();

    // Send cancellation email
    await sendRSVPCancelEmail(user.email);

    res.json({ message: "RSVP cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling RSVP:", error);
    res.status(500).json({ message: "Error cancelling RSVP" });
  }
});

export default router;
