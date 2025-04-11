import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from './User.js';
import Event from './Event.js';

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  event_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Event,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  attendance_status: {
    type: DataTypes.TEXT
  },
  created_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'attendance',
  timestamps: false
});

// Define associations
User.belongsToMany(Event, { through: Attendance, foreignKey: 'user_id' });
Event.belongsToMany(User, { through: Attendance, foreignKey: 'event_id' });
Attendance.belongsTo(User, { foreignKey: 'user_id' });
Attendance.belongsTo(Event, { foreignKey: 'event_id' });

export default Attendance;