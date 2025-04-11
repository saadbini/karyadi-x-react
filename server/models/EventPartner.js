import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import Event from './Event.js';
import Organization from './Organization.js';

const EventPartner = sequelize.define('EventPartner', {
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
  event_partner_tier: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'event_partner',
  timestamps: false
});

// Define associations
Event.belongsToMany(Organization, { 
  through: EventPartner,
  foreignKey: 'event_id',
  otherKey: 'organization_id',
  as: 'partners'
});

Organization.belongsToMany(Event, {
  through: EventPartner,
  foreignKey: 'organization_id',
  otherKey: 'event_id',
  as: 'partneredEvents'
});

EventPartner.belongsTo(Organization, { foreignKey: 'organization_id' });
EventPartner.belongsTo(Event, { foreignKey: 'event_id' });

export default EventPartner;