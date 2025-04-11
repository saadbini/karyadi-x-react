import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from './User.js';

const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  display_name: {
    type: DataTypes.STRING(255)
  },
  gender: {
    type: DataTypes.STRING(255)
  },
  date_of_birth: {
    type: DataTypes.DATE
  },
  user_location: {
    type: DataTypes.STRING(255)
  },
  nationality: {
    type: DataTypes.STRING(255)
  },  
  profile_desc: {
    type: DataTypes.TEXT
  },
  language: {
    type: DataTypes.STRING(255)
  },
  profile_img: {
    type: DataTypes.TEXT
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'user_profile',
  timestamps: false
});

// Define association
UserProfile.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(UserProfile, { foreignKey: 'user_id' });

export default UserProfile;