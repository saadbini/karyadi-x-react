import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from './User.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT
  },
  event_type: {
    type: DataTypes.TEXT
  },
  event_status: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.TEXT
  },
  start_time: {
    type: DataTypes.DATE
  },
  end_time: {
    type: DataTypes.DATE
  },
  start_date: {
    type: DataTypes.DATEONLY
  },
  end_date: {
    type: DataTypes.DATEONLY
  },
  location_url: {
    type: DataTypes.TEXT
  },
  virtual_link: {
    type: DataTypes.TEXT
  },
  slots: {
    type: DataTypes.INTEGER
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
  tableName: 'event',
  timestamps: false
});

// Define association
Event.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Event, { foreignKey: 'created_by', as: 'createdEvents' });

export default Event;