import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';

const Education = sequelize.define('Education', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  education_level: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  institution_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  degree: {
    type: DataTypes.STRING(255)
  },
  field_of_study: {
    type: DataTypes.STRING(255)
  },
  start_date: {
    type: DataTypes.DATE
  },
  end_date: {
    type: DataTypes.DATE
  },
  education_status: {
    type: DataTypes.STRING(50)
  },
  grade: {
    type: DataTypes.STRING(50)
  },
  activities: {
    type: DataTypes.TEXT
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'education_history',
  timestamps: true,
  createdAt: 'created_on',
  updatedAt: 'updated_at'
});

export default Education;
