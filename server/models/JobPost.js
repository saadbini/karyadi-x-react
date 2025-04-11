import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from './User.js';
import Organization from './Organization.js';

const JobPost = sequelize.define('JobPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  job_post_status: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  employment_type: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  job_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  minimum_qualification: {
    type: DataTypes.TEXT
  },
  workplace_type: {
    type: DataTypes.TEXT
  },
  industry: {
    type: DataTypes.TEXT
  },
  application_deadline: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  no_of_vacancies: {
    type: DataTypes.INTEGER
  },
  minimum_salary: {
    type: DataTypes.DECIMAL
  },
  maximum_salary: {
    type: DataTypes.DECIMAL
  },
  organization_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Organization,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  created_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'job_post',
  timestamps: false
});

// Define associations
JobPost.belongsTo(Organization, { foreignKey: 'organization_id' });
JobPost.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Organization.hasMany(JobPost, { foreignKey: 'organization_id' });
User.hasMany(JobPost, { foreignKey: 'created_by', as: 'createdJobPosts' });

export default JobPost;