import express from 'express';
import { User, UserProfile } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// User: Update own profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await profile.update(req.body);

    const updatedProfile = await UserProfile.findOne({
      where: { user_id: req.user.id },
      include: [{ model: User, attributes: ['name', 'email', 'user_type'] }]
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error updating own profile:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all profiles (Admin only ideally)
router.get("/", async (req, res) => {
  try {
    const profiles = await UserProfile.findAll({
      include: [{ model: User, attributes: ['name', 'email', 'user_type'] }]
    });
    res.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Error fetching profiles" });
  }
});

// Admin: Get any user's profile by user_id
router.get("/user/:id", async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      where: { user_id: req.params.id },
      include: [{ model: User, attributes: ['name', 'email', 'user_type'] }]
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Update any user's profile by profile id
router.put("/:id", async (req, res) => {
  try {
    const profile = await UserProfile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await profile.update(req.body);

    const updatedProfile = await UserProfile.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name', 'email', 'user_type'] }]
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Delete any user's profile by profile id
router.delete("/:id", async (req, res) => {
  try {
    const profile = await UserProfile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await profile.destroy();
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User: Get own profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      where: { user_id: req.user.id },
      include: [{ model: User, attributes: ['name', 'email', 'user_type'] }]
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching own profile:", error);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;
