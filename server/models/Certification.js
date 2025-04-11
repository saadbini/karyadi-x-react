import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';

const Certification = sequelize.define('Certification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  certification_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  issuing_organization: {
    type: DataTypes.STRING(255)
  },
  issue_date: {
    type: DataTypes.DATE
  },
  has_expiration_date: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expiration_date: {
    type: DataTypes.DATE
  },
  credential_id: {
    type: DataTypes.STRING(255)
  },
  credential_url: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'certification',
  timestamps: true,         // ✅ Enables createdAt & updatedAt
  createdAt: 'created_on',  // ✅ Maps createdAt → created_on
  updatedAt: 'updated_at'   // ✅ Maps updatedAt → updated_at
});

export default Certification;
