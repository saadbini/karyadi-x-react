import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import Event from './Event.js';
import Organization from './Organization.js';

const EventOrganizer = sequelize.define('EventOrganizer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  organizer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Organization,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  is_main_organizer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'event_organizer',
  timestamps: false
});

// Define many-to-many associations
Event.belongsToMany(Organization, { 
  through: EventOrganizer,
  foreignKey: 'event_id',
  otherKey: 'organizer_id',
  as: 'organizers'
});

Organization.belongsToMany(Event, {
  through: EventOrganizer,
  foreignKey: 'organizer_id',
  otherKey: 'event_id',
  as: 'organizedEvents'
});

// Define direct associations for eager loading
EventOrganizer.belongsTo(Organization, { foreignKey: 'organizer_id' });
EventOrganizer.belongsTo(Event, { foreignKey: 'event_id' });

export default EventOrganizer;