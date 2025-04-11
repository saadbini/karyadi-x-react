import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import Event from './Event.js';
import Organization from './Organization.js';

const EventSponsor = sequelize.define('EventSponsor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  organization_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Organization,
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
  event_sponsor_tier: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'event_sponsor',
  timestamps: false
});

// Define associations
Event.belongsToMany(Organization, { 
  through: EventSponsor,
  foreignKey: 'event_id',
  otherKey: 'organization_id',
  as: 'sponsors'
});

Organization.belongsToMany(Event, {
  through: EventSponsor,
  foreignKey: 'organization_id',
  otherKey: 'event_id',
  as: 'sponsoredEvents'
});

EventSponsor.belongsTo(Organization, { foreignKey: 'organization_id' });
EventSponsor.belongsTo(Event, { foreignKey: 'event_id' });

export default EventSponsor;