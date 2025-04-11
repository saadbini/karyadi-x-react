import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from './User.js';
import JobPost from './JobPost.js';

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  job_post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: JobPost,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  created_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'job_application',
  timestamps: false
});

// Define associations
JobApplication.belongsTo(User, { foreignKey: 'user_id' });
JobApplication.belongsTo(JobPost, { foreignKey: 'job_post_id' });
User.hasMany(JobApplication, { foreignKey: 'user_id' });
JobPost.hasMany(JobApplication, { foreignKey: 'job_post_id' });

export default JobApplication;