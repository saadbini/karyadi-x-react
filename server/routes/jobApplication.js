import express from "express";
import { JobApplication, User, JobPost, Organization} from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all job applications
router.get("/", authenticateToken, async (req, res) => {
  try {
    const jobApplications = await JobApplication.findAll({
      attributes: ['id', 'user_id', 'job_post_id', 'created_on'],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: JobPost,
          include: [{ model: Organization }]
        }
      ]
    });
    res.json(jobApplications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: "Error fetching job applications" });
  }
});

// Get job application by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const jobApplication = await JobApplication.findByPk(id, {
      attributes: ['id', 'user_id', 'job_post_id', 'created_on', 'job_application_status', 'updated_on'],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: JobPost,
          include: [{ model: Organization }]
        }
      ]
    });

    if (!jobApplication) {
      return res.status(404).json({ message: "Job application not found" });
    }

    // Check if user has permission to view
    if (jobApplication.user_id !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to view this application" });
    }

    res.json(jobApplication);
  } catch (error) {
    console.error("Error fetching job application:", error);
    res.status(500).json({ message: "Error fetching job application" });
  }
});

// Create new job application
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { job_post_id } = req.body;

    // Check if user has already applied
    const existingApplication = await JobApplication.findOne({
      where: {
        user_id: req.user.id,
        job_post_id
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const jobApplication = await JobApplication.create({
      user_id: req.user.id,
      job_post_id
    });

    const applicationWithDetails = await JobApplication.findByPk(jobApplication.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: JobPost,
          include: [{ model: Organization }]
        }
      ]
    });

    res.status(201).json(applicationWithDetails);
  } catch (error) {
    console.error("Error creating job application:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid job_post_id provided" });
    } else {
      res.status(500).json({ message: "Error creating job application" });
    }
  }
});

// Delete job application
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const jobApplication = await JobApplication.findByPk(id);

    if (!jobApplication) {
      return res.status(404).json({ message: "Job application not found" });
    }

    // Check if user has permission to delete
    if (jobApplication.user_id !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this application" });
    }

    await jobApplication.destroy();
    res.json({ message: "Job application deleted successfully" });
  } catch (error) {
    console.error("Error deleting job application:", error);
    res.status(500).json({ message: "Error deleting job application" });
  }
});

// Get job applications by user_id
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user has permission to view
    if (parseInt(userId) !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    const applications = await JobApplication.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: JobPost,
          include: [{ model: Organization }]
        }
      ],
      order: [['created_on', 'DESC']]
    });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching job applications by user_id:", error);
    res.status(500).json({ message: "Error fetching job applications by user_id" });
  }
});

// Get job applications by job_post_id
router.get("/job-post/:jobPostId", authenticateToken, async (req, res) => {
  try {
    const { jobPostId } = req.params;
    
    // First check if the user has permission to view these applications
    const jobPost = await JobPost.findByPk(jobPostId);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    // Only allow admin or the job post creator to view applications
    if (jobPost.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    const applications = await JobApplication.findAll({
      where: { job_post_id: jobPostId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: JobPost,
          include: [{ model: Organization }]
        }
      ],
      order: [['created_on', 'DESC']]
    });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching job applications by job_post_id:", error);
    res.status(500).json({ message: "Error fetching job applications by job_post_id" });
  }
});

// Update job application status
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { job_application_status } = req.body;

    // Ensure a valid status is provided
    if (!job_application_status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const jobApplication = await JobApplication.findByPk(id);

    if (!jobApplication) {
      return res.status(404).json({ message: "Job application not found" });
    }

    // Only allow admin or job owner to update the status
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update job application status" });
    }

    // Update the job application status
    jobApplication.job_application_status = job_application_status;
    await jobApplication.save();

    res.json({ message: "Job application status updated successfully", jobApplication });
  } catch (error) {
    console.error("Error updating job application status:", error);
    res.status(500).json({ message: "Error updating job application status" });
  }
});

export default router;
