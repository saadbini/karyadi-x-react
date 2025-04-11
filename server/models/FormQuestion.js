import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';

const FormQuestion = sequelize.define('FormQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  form_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    get() {
      const val = this.getDataValue('options');
      try {
        return typeof val === 'string' ? JSON.parse(val) : (Array.isArray(val) ? val : []);
      } catch (e) {
        return [];
      }
    }
  },
  order_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  additional_settings: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
    get() {
      const val = this.getDataValue('additional_settings');
      try {
        return typeof val === 'string' ? JSON.parse(val) : (val || {});
      } catch (e) {
        return {};
      }
    }
  }
}, {
  tableName: 'form_question',
  timestamps: false
});

// Add custom methods for forms.js routes
FormQuestion.createMany = async function(questions, formId) {
  try {
    const questionsToCreate = questions.map(q => ({
      form_id: formId,
      section_id: q.section_id || null,
      question: q.question,
      type: q.type,
      options: Array.isArray(q.options) ? q.options : [],
      order_number: q.order_number,
      is_required: q.is_required || false,
      additional_settings: q.additional_settings || {}
    }));

    return await FormQuestion.bulkCreate(questionsToCreate);
  } catch (error) {
    console.error('Error in FormQuestion.createMany:', error);
    throw error;
  }
};

FormQuestion.deleteByFormId = async function(formId) {
  try {
    await sequelize.query(`
      DELETE FROM form_question WHERE form_id = ?
    `, {
      replacements: [formId],
      type: sequelize.QueryTypes.DELETE
    });
    return true;
  } catch (error) {
    console.error('Error in FormQuestion.deleteByFormId:', error);
    throw error;
  }
};

FormQuestion.getQuestionsBySectionId = async function(sectionId) {
  try {
    const questions = await sequelize.query(`
      SELECT 
        id,
        question,
        type,
        options,
        order_number,
        is_required,
        additional_settings
      FROM form_question 
      WHERE section_id = :sectionId
      ORDER BY order_number ASC
    `, {
      replacements: { sectionId },
      type: sequelize.QueryTypes.SELECT
    });
    
    // Parse JSON fields and ensure the additional_settings contains sectionJumps if applicable
    return questions.map(q => {
      const options = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []);
      let additionalSettings = typeof q.additional_settings === 'string' ? 
                              JSON.parse(q.additional_settings) : 
                              (q.additional_settings || {});
                              
      // Make sure sectionJumps is present for multiple choice questions
      if (q.type === 'multiple_choice' && !additionalSettings.sectionJumps) {
        additionalSettings.sectionJumps = {};
      }
      
      return {
        ...q,
        options,
        additional_settings: additionalSettings
      };
    });
  } catch (error) {
    console.error('Error in FormQuestion.getQuestionsBySectionId:', error);
    throw error;
  }
};

export default FormQuestion;