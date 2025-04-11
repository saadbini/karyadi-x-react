import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from './User.js';

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  organization_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  logo: {
    type: DataTypes.TEXT
  },
  no_of_employees: {
    type: DataTypes.INTEGER, 
    allowNull: true
  },
  website_url: {
    type: DataTypes.TEXT
  },
  industry_category: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  created_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'organization',
  timestamps: false
});

// Define association
Organization.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Organization, { foreignKey: 'created_by', as: 'createdOrganizations' });

export default Organization;