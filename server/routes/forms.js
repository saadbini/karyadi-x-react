import express from 'express';
import { Form, FormQuestion, FormResponse, FormSection } from '../models/index.js';
import { authenticateToken as authenticate } from '../middleware/auth.js';
import sequelize from '../db/config.js';// Add this import

const router = express.Router();

// Get all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.getAllForms();
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get forms by event ID
router.get('/event/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    console.log(`Server: Fetching forms for event ID: ${eventId}`);
    
    const forms = await Form.getFormsByEventId(eventId);
    console.log(`Server: Found ${forms.length} forms for event ID ${eventId}`);
    
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching forms by event ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific form with questions
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.getFormWithQuestions(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Ensure questions is always an array
    form.questions = form.questions || [];
    
    res.status(200).json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new form
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, event_id, questions } = req.body;
    
    // Create the form
    const form = await Form.create({
      title,
      event_id,
      created_by: req.user.id
    });
    
    // Create the questions
    if (questions && questions.length > 0) {
      await FormQuestion.createMany(questions, form.id);
    }
    
    // Get the complete form with questions
    const completeForm = await Form.getFormWithQuestions(form.id);
    
    res.status(201).json(completeForm);
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an existing form
router.put('/:id', authenticate, async (req, res) => {
  try {
    const formId = req.params.id;
    const formData = req.body;
    
    // Fix: Pass parameters in correct order - formId as first param, formData as second
    await Form.update(formId, formData);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a form
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const formId = req.params.id;
    
    // Get the existing form to check permission
    const existingForm = await Form.findByPk(formId);
    
    if (!existingForm) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    // Delete the form (cascade should handle questions)
    await Form.destroy({ where: { id: formId } });
    
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a form response
router.post('/:id/responses', authenticate, async (req, res) => {
  try {
    const { responses } = req.body;
    const formId = req.params.id;
    
    // Check if form exists
    const form = await Form.getFormWithQuestions(formId);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    // Create the response - using JSONB
    const formResponse = await FormResponse.create({
      form_id: formId,
      user_id: req.user.id,
      responses
    });
    
    res.status(201).json(formResponse);
  } catch (error) {
    console.error('Error submitting form response:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all responses for a form
router.get('/:id/responses', authenticate, async (req, res) => {
  try {
    const formId = req.params.id;
    
    // Check if form exists
    const form = await Form.findByPk(formId);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Only allow admins and form creators to view responses
    if (req.user.user_type !== 'admin' && form.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view form responses' });
    }
    
    // Get the responses
    const responses = await FormResponse.getByFormId(formId);
    
    res.status(200).json(responses);
  } catch (error) {
    console.error('Error fetching form responses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get summary for a form's responses (for charts/analytics)
router.get('/:id/summary', authenticate, async (req, res) => {
  try {
    const formId = req.params.id;
    
    // Check if form exists
    const form = await Form.findByPk(formId);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Only allow admins and form creators to view summary
    if (req.user.user_type !== 'admin' && form.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view form summary' });
    }
    
    // Get the summary
    const summary = await FormResponse.getSummaryByFormId(formId);
    
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error generating form summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all forms that a user has submitted responses for
router.get('/user-submissions/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Ensure user can only access their own submissions unless they're an admin
    if (req.user.id !== parseInt(userId) && req.user.user_type !== 'admin') { // Note: user_type not userType
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Query to get all form IDs that the user has submitted
    const submissions = await sequelize.query(`
      SELECT DISTINCT form_id 
      FROM form_response 
      WHERE user_id = :userId
    `, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT
    });
    
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching user form submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get form with sections and questions (complete data)
router.get('/:id/with-sections', async (req, res) => {
  try {
    const form = await Form.getFormWithSections(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Error getting form with sections:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get only the sections for a form (without questions)
router.get('/:formId/sections', async (req, res) => {
  try {
    const sections = await FormSection.getSectionsByFormId(req.params.formId);
    res.json(sections);
  } catch (error) {
    console.error('Error getting form sections:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get questions for a section
router.get('/sections/:sectionId/questions', async (req, res) => {
  try {
    const questions = await FormQuestion.getQuestionsBySectionId(req.params.sectionId);
    res.json(questions);
  } catch (error) {
    console.error('Error getting section questions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;