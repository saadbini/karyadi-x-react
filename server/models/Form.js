import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import FormQuestion from './FormQuestion.js';
import User from './User.js';
import Event from './Event.js';

const Form = sequelize.define('Form', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  banner_image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'form',
  timestamps: false
});

// Add custom methods for the routes
Form.getAllForms = async function () {
  try {
    const [results] = await sequelize.query(`
      SELECT f.*, e.name as event_name, u.name as creator_name 
      FROM form f
      LEFT JOIN event e ON f.event_id = e.id
      LEFT JOIN users u ON f.created_by = u.id
      ORDER BY f.created_on ASC
    `);
    return results;
  } catch (error) {
    console.error('Error in Form.getAllForms:', error);
    throw error;
  }
};

Form.getFormsByEventId = async function (eventId) {
  try {
    // Remove the destructuring brackets [results]
    const results = await sequelize.query(`
      SELECT f.*, u.name as creator_name 
      FROM form f
      LEFT JOIN users u ON f.created_by = u.id
      WHERE f.event_id = :eventId
      ORDER BY f.created_on ASC
    `, {
      replacements: { eventId },
      type: sequelize.QueryTypes.SELECT
    });

    console.log(`Found ${results.length} forms for event ${eventId}`);
    return results; // Return the full array of results
  } catch (error) {
    console.error('Error in Form.getFormsByEventId:', error);
    throw error;
  }
};

Form.getFormWithQuestions = async function (id) {
  try {
    // First get the form with event and creator info
    const [[formResult], questions] = await Promise.all([
      sequelize.query(`
        SELECT f.*, e.name as event_name, u.name as creator_name 
        FROM form f
        LEFT JOIN event e ON f.event_id = e.id
        LEFT JOIN users u ON f.created_by = u.id
        WHERE f.id = :id
      `, {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT
      }),
      sequelize.query(`
        SELECT 
          id,
          question,
          type,
          options,
          order_number,
          is_required,
          additional_settings
        FROM form_question 
        WHERE form_id = :id
        ORDER BY order_number ASC
      `, {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT
      })
    ]);

    if (!formResult) {
      return null;
    }

    // Parse JSON fields in questions
    const parsedQuestions = questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []),
      additional_settings: typeof q.additional_settings === 'string' ? JSON.parse(q.additional_settings) : (q.additional_settings || {})
    }));

    // Format the result into form with nested questions array
    return {
      id: formResult.id,
      title: formResult.title,
      description: formResult.description,
      banner_image: formResult.banner_image,
      event_id: formResult.event_id,
      event_name: formResult.event_name,
      created_by: formResult.created_by,
      creator_name: formResult.creator_name,
      created_on: formResult.created_on,
      questions: parsedQuestions
    };
  } catch (error) {
    console.error('Error in Form.getFormWithQuestions:', error);
    throw error;
  }
};

Form.getFormWithSections = async function (id) {
  try {
    // First get the form with event and creator info
    const [formResult] = await sequelize.query(`
      SELECT f.*, e.name as event_name, u.name as creator_name 
      FROM form f
      LEFT JOIN event e ON f.event_id = e.id
      LEFT JOIN users u ON f.created_by = u.id
      WHERE f.id = :id
    `, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });

    if (!formResult) {
      return null;
    }

    // Get all sections for this form
    const sections = await sequelize.query(`
      SELECT * FROM form_section
      WHERE form_id = :id
      ORDER BY order_number ASC
    `, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });

    // Get all questions for this form
    const questions = await sequelize.query(`
      SELECT 
        id,
        section_id,
        question,
        type,
        options,
        order_number,
        is_required,
        additional_settings
      FROM form_question 
      WHERE form_id = :id
      ORDER BY order_number ASC
    `, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });

    // Parse JSON fields in questions
    const parsedQuestions = questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []),
      additional_settings: typeof q.additional_settings === 'string' ? JSON.parse(q.additional_settings) : (q.additional_settings || {})
    }));

    // Group questions by section
    const sectionsWithQuestions = sections.map(section => {
      const sectionQuestions = parsedQuestions.filter(q => q.section_id === section.id);
      return {
        ...section,
        questions: sectionQuestions
      };
    });

    // Also include questions without a section (null section_id)
    const unsectionedQuestions = parsedQuestions.filter(q => q.section_id === null);

    // Format the result into form with nested sections and questions arrays
    return {
      id: formResult.id,
      title: formResult.title,
      description: formResult.description,
      banner_image: formResult.banner_image,
      event_id: formResult.event_id,
      event_name: formResult.event_name,
      created_by: formResult.created_by,
      creator_name: formResult.creator_name,
      created_on: formResult.created_on,
      sections: sectionsWithQuestions,
      questions: unsectionedQuestions // Questions not assigned to any section
    };
  } catch (error) {
    console.error('Error in Form.getFormWithSections:', error);
    throw error;
  }
};

Form.getById = async function (id) {
  try {
    const [results] = await sequelize.query(`
      SELECT * FROM form WHERE id = :id
    `, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });
    return results && results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error in Form.getById:', error);
    throw error;
  }
};

Form.update = async function (id, data) {
  try {
    console.log('Form.update received:', { id, data });

    // Check if data object has the required properties
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data object provided to Form.update');
    }

    // If we're only updating sections or questions, get the existing form data first
    // to preserve required fields like event_id
    let formUpdateNeeded = false;
    let existingForm = null;
    
    // Check if we're updating basic form properties or just sections/questions
    const isUpdatingBasicForm = data.title !== undefined || 
                               data.description !== undefined || 
                               data.event_id !== undefined ||
                               data.banner_image !== undefined;
    
    // If we're only updating sections/questions, fetch the existing form data
    if (!isUpdatingBasicForm && (Array.isArray(data.sections) || Array.isArray(data.questions))) {
      const [formResult] = await sequelize.query(`
        SELECT * FROM form WHERE id = :id
      `, {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT
      });
      
      existingForm = formResult;
      
      if (!existingForm) {
        throw new Error(`Form with ID ${id} not found`);
      }
    } else {
      formUpdateNeeded = true;
    }

    // Extract properties with fallbacks to prevent undefined values
    // Use existing form data as fallback when available
    const title = data.title !== undefined ? data.title : (existingForm ? existingForm.title : '');
    const description = data.description !== undefined ? data.description : (existingForm ? existingForm.description : null);
    
    // Always ensure event_id is not null - use existing or explicitly provided
    const event_id = data.event_id !== undefined ? data.event_id : (existingForm ? existingForm.event_id : null);
    
    if (event_id === null) {
      throw new Error('Event ID cannot be null when updating a form');
    }
    
    const banner_image = data.banner_image !== undefined ? data.banner_image : (existingForm ? existingForm.banner_image : null);

    console.log('Using values for update:', { title, description, event_id, banner_image });

    // Only update the form properties if needed
    if (formUpdateNeeded) {
      await sequelize.query(`
        UPDATE form
        SET title = :title,
            description = :description,
            event_id = :event_id,
            banner_image = :banner_image
        WHERE id = :id
      `, {
        replacements: {
          id,
          title,
          description,
          event_id,
          banner_image
        },
        type: sequelize.QueryTypes.UPDATE
      });
    }

    // Rest of the function (handling sections and questions) remains the same
    // Handle sections update if sections are provided
    if (Array.isArray(data.sections)) {
      // First, get existing section IDs for this form
      const existingSectionsResult = await sequelize.query(`
        SELECT id FROM form_section WHERE form_id = :formId
      `, {
        replacements: { formId: id },
        type: sequelize.QueryTypes.SELECT
      });

      const existingSectionIds = existingSectionsResult.map(s => s.id);
      console.log('Existing section IDs:', existingSectionIds);

      // Track which IDs we've processed to determine what to delete later
      const processedSectionIds = [];

      // Process each section
      for (const section of data.sections) {
        if (section.id && existingSectionIds.includes(parseInt(section.id))) {
          // Update existing section
          const sectionId = parseInt(section.id);
          processedSectionIds.push(sectionId);

          await sequelize.query(`
            UPDATE form_section
            SET title = :title,
                description = :description,
                order_number = :order_number
            WHERE id = :id
          `, {
            replacements: {
              id: sectionId,
              title: section.title,
              description: section.description || null,
              order_number: section.order_number
            },
            type: sequelize.QueryTypes.UPDATE
          });
        } else {
          // Insert new section
          const [result] = await sequelize.query(`
            INSERT INTO form_section 
            (form_id, title, description, order_number)
            VALUES 
            (:form_id, :title, :description, :order_number)
            RETURNING id
          `, {
            replacements: {
              form_id: id,
              title: section.title,
              description: section.description || null,
              order_number: section.order_number
            },
            type: sequelize.QueryTypes.INSERT
          });
          
          // Store the new section id
          const newSectionId = result[0].id;
          processedSectionIds.push(newSectionId);
          
          // Update the section id in questions that reference this section
          if (Array.isArray(section.questions)) {
            section.questions.forEach(question => {
              question.section_id = newSectionId;
            });
          }
        }
      }

      // Delete sections that are no longer present
      const sectionIdsToDelete = existingSectionIds.filter(id => !processedSectionIds.includes(id));
      if (sectionIdsToDelete.length > 0) {
        await sequelize.query(`
          DELETE FROM form_section
          WHERE id IN (:ids)
        `, {
          replacements: { ids: sectionIdsToDelete },
          type: sequelize.QueryTypes.DELETE
        });
      }
    }

    // Handle questions update if questions are provided
    if (Array.isArray(data.questions)) {
      // First, get existing question IDs for this form
      const existingQuestionsResult = await sequelize.query(`
        SELECT id FROM form_question WHERE form_id = :formId
      `, {
        replacements: { formId: id },
        type: sequelize.QueryTypes.SELECT
      });

      // sequelize.query with SELECT returns the results directly, not as [results, metadata]
      const existingIds = existingQuestionsResult.map(q => q.id);
      console.log('Existing question IDs:', existingIds);

      // Track which IDs we've processed to determine what to delete later
      const processedIds = [];

      // Process each question
      for (const question of data.questions) {
        if (question.id && existingIds.includes(parseInt(question.id))) {
          // Update existing question
          const questionId = parseInt(question.id);
          processedIds.push(questionId);

          await sequelize.query(`
            UPDATE form_question
            SET question = :question,
                type = :type,
                options = :options,
                order_number = :order_number,
                is_required = :is_required,
                additional_settings = :additional_settings,
                section_id = :section_id
            WHERE id = :id
          `, {
            replacements: {
              id: questionId,
              question: question.question,
              type: question.type,
              options: JSON.stringify(question.options || []),
              order_number: question.order_number,
              is_required: question.is_required ? true : false,
              additional_settings: JSON.stringify(question.additional_settings || {}),
              section_id: question.section_id || null
            },
            type: sequelize.QueryTypes.UPDATE
          });
        } else {
          // Insert new question
          await sequelize.query(`
            INSERT INTO form_question 
            (form_id, section_id, question, type, options, order_number, is_required, additional_settings)
            VALUES 
            (:form_id, :section_id, :question, :type, :options, :order_number, :is_required, :additional_settings)
          `, {
            replacements: {
              form_id: id,
              section_id: question.section_id || null,
              question: question.question,
              type: question.type,
              options: JSON.stringify(question.options || []),
              order_number: question.order_number,
              is_required: question.is_required ? true : false,
              additional_settings: JSON.stringify(question.additional_settings || {})
            },
            type: sequelize.QueryTypes.INSERT
          });
        }
      }

      // Delete questions that are no longer present
      const idsToDelete = existingIds.filter(id => !processedIds.includes(id));
      if (idsToDelete.length > 0) {
        await sequelize.query(`
          DELETE FROM form_question
          WHERE id IN (:ids)
        `, {
          replacements: { ids: idsToDelete },
          type: sequelize.QueryTypes.DELETE
        });
      }
    }

    return { id, ...data };
  } catch (error) {
    console.error('Error in Form.update:', error);
    throw error;
  }
};

Form.delete = async function (id) {
  try {
    // Delete questions first (in case there's no cascade delete in DB)
    await sequelize.query(`
      DELETE FROM form_question WHERE form_id = :id
    `, {
      replacements: { id },
      type: sequelize.QueryTypes.DELETE
    });

    // Then delete the form
    await sequelize.query(`
      DELETE FROM form WHERE id = :id
    `, {
      replacements: { id },
      type: sequelize.QueryTypes.DELETE
    });

    return true;
  } catch (error) {
    console.error('Error in Form.delete:', error);
    throw error;
  }
};

export default Form;