import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import Event from './Event.js';

const Agenda = sequelize.define('Agenda', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  start_time: {
    type: DataTypes.DATE
  },
  end_time: {
    type: DataTypes.DATE
  },
  slido_url: {
    type: DataTypes.TEXT
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
  tableName: 'agenda',
  timestamps: false
});

// Define associations
Agenda.belongsTo(Event, { foreignKey: 'event_id' });
Event.hasMany(Agenda, { foreignKey: 'event_id' });

export default Agenda;