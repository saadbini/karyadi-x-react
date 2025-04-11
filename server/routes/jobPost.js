import express from "express";
import { JobPost, User, Organization } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all job posts
router.get("/", async (req, res) => {
  try {
    const jobPosts = await JobPost.findAll({
      include: [
        { model: Organization },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_on', 'DESC']]
    });
    res.json(jobPosts);
  } catch (error) {
    console.error("Error fetching job posts:", error);
    res.status(500).json({ message: "Error fetching job posts" });
  }
});

// Get job post by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const jobPost = await JobPost.findByPk(id, {
      include: [
        { model: Organization },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }
    res.json(jobPost);
  } catch (error) {
    console.error("Error fetching job post:", error);
    res.status(500).json({ message: "Error fetching job post" });
  }
});

// Create new job post
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      job_post_status,
      employment_type,
      job_description,
      minimum_qualification,
      workplace_type,
      industry,
      application_deadline,
      no_of_vacancies,
      minimum_salary,
      maximum_salary,
      organization_id
    } = req.body;

    const newJobPost = await JobPost.create({
      title,
      job_post_status,
      employment_type,
      job_description,
      minimum_qualification,
      workplace_type,
      industry,
      application_deadline,
      no_of_vacancies,
      minimum_salary,
      maximum_salary,
      organization_id,
      created_by: req.user.id
    });

    const jobPostWithDetails = await JobPost.findByPk(newJobPost.id, {
      include: [
        { model: Organization },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json(jobPostWithDetails);
  } catch (error) {
    console.error("Error creating job post:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid organization_id provided" });
    } else {
      res.status(500).json({ message: "Error creating job post" });
    }
  }
});

// Update job post
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      job_post_status,
      employment_type,
      job_description,
      minimum_qualification,
      workplace_type,
      industry,
      application_deadline,
      no_of_vacancies,
      minimum_salary,
      maximum_salary,
      organization_id
    } = req.body;

    const jobPost = await JobPost.findByPk(id);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    // Check if user has permission to update
    if (jobPost.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this job post" });
    }

    const updatedJobPost = await jobPost.update({
      title,
      job_post_status,
      employment_type,
      job_description,
      minimum_qualification,
      workplace_type,
      industry,
      application_deadline,
      no_of_vacancies,
      minimum_salary,
      maximum_salary,
      organization_id
    });

    const jobPostWithDetails = await JobPost.findByPk(updatedJobPost.id, {
      include: [
        { model: Organization },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json(jobPostWithDetails);
  } catch (error) {
    console.error("Error updating job post:", error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: "Invalid organization_id provided" });
    } else {
      res.status(500).json({ message: "Error updating job post" });
    }
  }
});

// Delete job post
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const jobPost = await JobPost.findByPk(id);
    
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    // Check if user has permission to delete
    if (jobPost.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this job post" });
    }

    await jobPost.destroy();
    res.json({ message: "Job post deleted successfully" });
  } catch (error) {
    console.error("Error deleting job post:", error);
    res.status(500).json({ message: "Error deleting job post" });
  }
});

// Get job posts by created_by
router.get("/created-by/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const jobPosts = await JobPost.findAll({
      where: { created_by: userId },
      include: [
        { model: Organization },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_on', 'DESC']]
    });
    res.json(jobPosts);
  } catch (error) {
    console.error("Error fetching job posts by created_by:", error);
    res.status(500).json({ message: "Error fetching job posts by created_by" });
  }
});

export default router;
