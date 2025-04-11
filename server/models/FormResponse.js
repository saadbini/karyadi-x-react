import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';

const FormResponse = sequelize.define('FormResponse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  form_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  responses: {
    type: DataTypes.JSONB,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('responses');
      try {
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      } catch (e) {
        return rawValue;
      }
    }
  },
  submitted_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'form_response',
  timestamps: false
});

// Get responses for a specific form
FormResponse.getByFormId = async function(formId) {
  try {
    // FIXED: Remove the destructuring brackets
    const responses = await sequelize.query(`
      SELECT fr.*, u.name as user_name
      FROM form_response fr
      LEFT JOIN users u ON fr.user_id = u.id
      WHERE fr.form_id = :formId
      ORDER BY fr.submitted_on DESC
    `, {
      replacements: { formId },
      type: sequelize.QueryTypes.SELECT
    });
    
    // Parse responses JSON if needed
    const parsedResponses = Array.isArray(responses) ? responses.map(r => ({
      ...r,
      responses: typeof r.responses === 'string' ? JSON.parse(r.responses) : r.responses
    })) : [];
    
    return parsedResponses;
  } catch (error) {
    console.error('Error in FormResponse.getByFormId:', error);
    throw error;
  }
};

// Get summary statistics for a form's responses
FormResponse.getSummaryByFormId = async function(formId) {
  try {
    // First, get the form with its questions
    // FIXED: Remove destructuring brackets
    const forms = await sequelize.query(`
      SELECT * FROM form WHERE id = :formId
    `, {
      replacements: { formId },
      type: sequelize.QueryTypes.SELECT
    });
    
    const form = forms[0];
    if (!form) return null;
    
    // Get the questions
    // FIXED: Remove destructuring brackets
    const questions = await sequelize.query(`
      SELECT * FROM form_question WHERE form_id = :formId ORDER BY order_number ASC
    `, {
      replacements: { formId },
      type: sequelize.QueryTypes.SELECT
    });
    
    // No need to check if it's an array - it will be
    const questionsArray = questions;
    
    // Get all responses
    // FIXED: Remove destructuring brackets
    const rawResponses = await sequelize.query(`
      SELECT responses FROM form_response WHERE form_id = :formId
    `, {
      replacements: { formId },
      type: sequelize.QueryTypes.SELECT
    });
    
    // These are already an array of response objects
    const responses = rawResponses;
    
    // Process the responses to generate summary data
    const summary = {
      form_id: formId,
      form_title: form.title,
      total_responses: responses.length,
      questions_summary: []
    };
    
    // Process each question to generate summary
    for (const question of questionsArray) {
      const questionSummary = {
        questionId: question.id,
        question: question.question,
        type: question.type,
        total_responses: 0
      };
      
      // For multiple choice, checkbox, and dropdown questions, count options
      if (['multiple_choice', 'checkbox', 'dropdown'].includes(question.type)) {
        questionSummary.option_counts = {};
        
        // Parse options if they are stored as JSON string
        let options = question.options;
        if (typeof options === 'string') {
          try {
            options = JSON.parse(options);
          } catch (e) {
            options = [];
          }
        }
        
        // Initialize counts for each option
        for (const option of options) {
          questionSummary.option_counts[option] = 0;
        }
        
        // Count responses for each option
        for (const response of responses) {
          const responseData = typeof response.responses === 'string' 
            ? JSON.parse(response.responses) 
            : response.responses;
          
          if (responseData?.[question.id]) {
            questionSummary.total_responses++;
            
            if (Array.isArray(responseData[question.id])) {
              // For checkbox questions (multiple selections)
              for (const selectedOption of responseData[question.id]) {
                if (questionSummary.option_counts[selectedOption] !== undefined) {
                  questionSummary.option_counts[selectedOption]++;
                } else {
                  questionSummary.option_counts[selectedOption] = 1;
                }
              }
            } else {
              // For single selection questions
              const selectedOption = responseData[question.id];
              if (questionSummary.option_counts[selectedOption] !== undefined) {
                questionSummary.option_counts[selectedOption]++;
              } else {
                questionSummary.option_counts[selectedOption] = 1;
              }
            }
          }
        }
      }
      // For rating and likert scale questions, calculate average
      else if (['rating', 'likert_single'].includes(question.type)) {
        let sum = 0;
        let count = 0;
        
        for (const response of responses) {
          const responseData = typeof response.responses === 'string' 
            ? JSON.parse(response.responses) 
            : response.responses;
          
          if (responseData?.[question.id] !== undefined && responseData[question.id] !== null) {
            const rating = parseInt(responseData[question.id], 10);
            if (!isNaN(rating)) {
              sum += rating;
              count++;
              questionSummary.total_responses++;
            }
          }
        }
        
        questionSummary.average = count > 0 ? sum / count : 0;
      }
      // For likert matrix questions, calculate average for each sub-question
      else if (question.type === 'likert_matrix') {
        questionSummary.subquestion_averages = {};
        
        // Parse additional settings for subquestions
        let additionalSettings = question.additional_settings;
        if (typeof additionalSettings === 'string') {
          try {
            additionalSettings = JSON.parse(additionalSettings);
          } catch (e) {
            additionalSettings = { subQuestions: [] };
          }
        }
        
        const subQuestions = additionalSettings?.subQuestions || [];
        
        // Initialize counters for each subquestion
        for (const subQuestion of subQuestions) {
          questionSummary.subquestion_averages[subQuestion] = {
            sum: 0,
            count: 0
          };
        }
        
        for (const response of responses) {
          const responseData = typeof response.responses === 'string' 
            ? JSON.parse(response.responses) 
            : response.responses;
          
          if (responseData?.[question.id]) {
            questionSummary.total_responses++;
            
            for (const subQuestion in responseData[question.id]) {
              if (questionSummary.subquestion_averages[subQuestion]) {
                const rating = parseInt(responseData[question.id][subQuestion], 10);
                if (!isNaN(rating)) {
                  questionSummary.subquestion_averages[subQuestion].sum += rating;
                  questionSummary.subquestion_averages[subQuestion].count++;
                }
              }
            }
          }
        }
        
        // Calculate averages
        for (const subQuestion in questionSummary.subquestion_averages) {
          const data = questionSummary.subquestion_averages[subQuestion];
          questionSummary.subquestion_averages[subQuestion] = 
            data.count > 0 ? data.sum / data.count : 0;
        }
      }
      // For text questions, provide sample responses
      else if (question.type === 'text') {
        const sampleResponses = [];
        
        for (const response of responses) {
          const responseData = typeof response.responses === 'string' 
            ? JSON.parse(response.responses) 
            : response.responses;
          
          if (responseData?.[question.id]) {
            questionSummary.total_responses++;
            if (sampleResponses.length < 5) {
              sampleResponses.push(responseData[question.id]);
            }
          }
        }
        
        questionSummary.sample_responses = sampleResponses;
      }
      
      summary.questions_summary.push(questionSummary);
    }
    
    return summary;
  } catch (error) {
    console.error('Error in FormResponse.getSummaryByFormId:', error);
    throw error;
  }
};

export default FormResponse;