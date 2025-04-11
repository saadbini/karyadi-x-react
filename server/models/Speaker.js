import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import Event from './Event.js';
import Agenda from './Agenda.js';

const Speaker = sequelize.define('Speaker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  designation: {
    type: DataTypes.TEXT
  },
  description: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.TEXT
  },
  agenda_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Agenda,
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
  }
}, {
  tableName: 'speaker',
  timestamps: false
});

// Define associations
Speaker.belongsTo(Event, { foreignKey: 'event_id' });
Speaker.belongsTo(Agenda, { foreignKey: 'agenda_id' });
Event.hasMany(Speaker, { foreignKey: 'event_id' });
Agenda.hasMany(Speaker, { foreignKey: 'agenda_id' });

export default Speaker;