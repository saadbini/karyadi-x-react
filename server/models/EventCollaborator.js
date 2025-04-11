import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import Event from './Event.js';
import Organization from './Organization.js';

const EventCollaborator = sequelize.define('EventCollaborator', {
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
  event_collaborator_type: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'event_collaborator',
  timestamps: false
});

// Define associations
Event.belongsToMany(Organization, { 
  through: EventCollaborator,
  foreignKey: 'event_id',
  otherKey: 'organization_id',
  as: 'collaborators'
});

Organization.belongsToMany(Event, {
  through: EventCollaborator,
  foreignKey: 'organization_id',
  otherKey: 'event_id',
  as: 'collaboratedEvents'
});

EventCollaborator.belongsTo(Organization, { foreignKey: 'organization_id' });
EventCollaborator.belongsTo(Event, { foreignKey: 'event_id' });

export default EventCollaborator;