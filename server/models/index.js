import User from './User.js';
import UserProfile from './UserProfile.js';
import Event from './Event.js';
import Organization from './Organization.js';
import Agenda from './Agenda.js';
import Speaker from './Speaker.js';
import Attendance from './Attendance.js';
import EventOrganizer from './EventOrganizer.js';
import EventPartner from './EventPartner.js';
import EventSponsor from './EventSponsor.js';
import EventCollaborator from './EventCollaborator.js';
import JobApplication from './JobApplication.js';
import JobPost from './JobPost.js';
import Judge from './Judge.js';
import Form from './Form.js';
import FormQuestion from './FormQuestion.js';
import FormResponse from './FormResponse.js';
import FormSection from './FormSection.js'; 
import Certification from './Certification.js';
import Education from './EducationHistory.js';
import sequelize from '../db/config.js';

// Associations for the Form related models
// For the main Form model
Form.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
Form.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Form.hasMany(FormQuestion, { foreignKey: 'form_id', as: 'questions' });
Form.hasMany(FormResponse, { foreignKey: 'form_id', as: 'responses' });
Form.hasMany(FormSection, { foreignKey: 'form_id', as: 'sections' });

// For FormSection model
FormSection.belongsTo(Form, { foreignKey: 'form_id' });
FormSection.hasMany(FormQuestion, { foreignKey: 'section_id', as: 'questions' });

// For FormQuestion model
FormQuestion.belongsTo(Form, { foreignKey: 'form_id' });
FormQuestion.belongsTo(FormSection, { foreignKey: 'section_id', as: 'section' });

FormResponse.belongsTo(Form, { foreignKey: 'form_id' });
FormResponse.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Certification, { foreignKey: 'user_id' });
Certification.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Education, { foreignKey: 'user_id' });
Education.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});


// Export models and associations
export {
  User,
  UserProfile,
  Event,
  Organization,
  Agenda,
  Speaker,
  Attendance,
  EventOrganizer,
  EventPartner,
  EventSponsor,
  EventCollaborator,
  JobApplication,
  JobPost,
  Judge,
  Form,
  FormQuestion,
  FormResponse,
  FormSection,
  Certification,
  Education,
  sequelize as default
};