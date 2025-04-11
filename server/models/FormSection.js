import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';

const FormSection = sequelize.define('FormSection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  form_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  order_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'form_section',
  timestamps: false
});

// Add custom methods for the routes
FormSection.getSectionsByFormId = async function(formId) {
  try {
    const sections = await sequelize.query(`
      SELECT * FROM form_section
      WHERE form_id = :formId
      ORDER BY order_number ASC
    `, {
      replacements: { formId },
      type: sequelize.QueryTypes.SELECT
    });
    
    return sections;
  } catch (error) {
    console.error('Error in FormSection.getSectionsByFormId:', error);
    throw error;
  }
};

FormSection.createMany = async function(sections, formId) {
  try {
    const sectionsToCreate = sections.map((section, index) => ({
      form_id: formId,
      title: section.title,
      description: section.description || null,
      order_number: section.order_number || index + 1
    }));

    return await FormSection.bulkCreate(sectionsToCreate);
  } catch (error) {
    console.error('Error in FormSection.createMany:', error);
    throw error;
  }
};

FormSection.deleteByFormId = async function(formId) {
  try {
    await sequelize.query(`
      DELETE FROM form_section WHERE form_id = :formId
    `, {
      replacements: { formId },
      type: sequelize.QueryTypes.DELETE
    });
    return true;
  } catch (error) {
    console.error('Error in FormSection.deleteByFormId:', error);
    throw error;
  }
};

export default FormSection;