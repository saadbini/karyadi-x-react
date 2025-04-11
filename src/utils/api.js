import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (data) => api.post("/auth/register", data),
  verifyToken: () => api.get("/auth/verify-token"),
};

export const sendPasswordResetEmail = (email) => {
  return api.post("/auth/forgot-password", { email });
};

export const userAPI = {
  getAllUsers: () => api.get("/users"),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post("/users", data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const eventsAPI = {
  getAllEvents: () => api.get("/events"),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post("/events", data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  updateEventSlots: (id, slots) => api.patch(`/events/${id}/slots`, { slots }),
};

export const agendaAPI = {
  getAllAgendas: () => api.get("/agendas"),
  getAgendaById: (id) => api.get(`/agendas/${id}`),
  createAgenda: (data) => api.post("/agendas", data),
  updateAgenda: (id, data) => api.put(`/agendas/${id}`, data),
  deleteAgenda: (id) => api.delete(`/agendas/${id}`),
  getAgendasByEventId: (eventId) => api.get(`/agendas/event/${eventId}`),
};

export const speakerAPI = {
  getAllSpeakers: () => api.get("/speakers"),
  getSpeakerById: (id) => api.get(`/speakers/${id}`),
  createSpeaker: (data) => api.post("/speakers", data),
  updateSpeaker: (id, data) => api.put(`/speakers/${id}`, data),
  deleteSpeaker: (id) => api.delete(`/speakers/${id}`),
  getSpeakersByAgendaId: (agendaId) => api.get(`/speakers/agenda/${agendaId}`),
  getSpeakersByEventId: (eventId) => api.get(`/speakers/event/${eventId}`),
};

export const organizationAPI = {
  getAllOrganizations: () => api.get("/organizations"),
  getOrganizationById: (id) => api.get(`/organizations/${id}`),
  createOrganization: (data) => api.post("/organizations", data),
  updateOrganization: (id, data) => api.put(`/organizations/${id}`, data),
  deleteOrganization: (id) => api.delete(`/organizations/${id}`),
};

export const eventOrganizerAPI = {
  getAllEventOrganizers: () => api.get("/event-organizers"),
  getEventOrganizerById: (id) => api.get(`/event-organizers/${id}`),
  createEventOrganizer: (data) => api.post("/event-organizers", data),
  updateEventOrganizer: (id, data) => api.put(`/event-organizers/${id}`, data),
  deleteEventOrganizer: (id) => api.delete(`/event-organizers/${id}`),
  getOrganizersByEventId: (eventId) =>
    api.get(`/event-organizers/event/${eventId}`),
};

export const partnerAPI = {
  getAllPartners: () => api.get("/partners"),
  getPartnerById: (id) => api.get(`/partners/${id}`),
  createPartner: (data) => api.post("/partners", data),
  updatePartner: (id, data) => api.put(`/partners/${id}`, data),
  deletePartner: (id) => api.delete(`/partners/${id}`),
  getPartnersByEventId: (eventId) => api.get(`/partners/event/${eventId}`),
};

export const sponsorAPI = {
  getAllSponsors: () => api.get("/sponsors"),
  getSponsorById: (id) => api.get(`/sponsors/${id}`),
  createSponsor: (data) => api.post("/sponsors", data),
  updateSponsor: (id, data) => api.put(`/sponsors/${id}`, data),
  deleteSponsor: (id) => api.delete(`/sponsors/${id}`),
  getSponsorsByEventId: (eventId) => api.get(`/sponsors/event/${eventId}`),
};

export const collaboratorAPI = {
  getAllCollaborators: () => api.get("/collaborators"),
  getCollaboratorById: (id) => api.get(`/collaborators/${id}`),
  createCollaborator: (data) => api.post("/collaborators", data),
  updateCollaborator: (id, data) => api.put(`/collaborators/${id}`, data),
  deleteCollaborator: (id) => api.delete(`/collaborators/${id}`),
  getCollaboratorsByEventId: (eventId) =>
    api.get(`/collaborators/event/${eventId}`),
};

export const attendanceAPI = {
  getAttendanceByUserId: (userId) => api.get(`/attendance/user/${userId}`),
  getAttendanceByEventId: (eventId) => api.get(`/attendance/event/${eventId}`),
  getAttendanceByUserAndEvent: (userId, eventId) =>
    api.get(`/attendance/user/${userId}/event/${eventId}`),
  createAttendance: (data) => api.post("/attendance", data),
  updateAttendance: (id, data) => api.put(`/attendance/${id}`, data),
  deleteAttendance: (id) => api.delete(`/attendance/${id}`),
  deleteAttendance: (userId, eventId) =>
    api.delete(`/attendance/${userId}/${eventId}`),
};

export const UserProfileAPI = {
  getOwnProfile: () => api.get("/profile/me"),
  updateOwnProfile: (data) => api.put("/profile/me", data),
  
  // Keep existing admin routes:
  getProfileByUserId: (id) => api.get(`/profile/user/${id}`),
  updateProfile: (id, data) => api.put(`/profile/user/${id}`, data),
  deleteProfile: (id) => api.delete(`/profile/user/${id}`),
};


export const jobApplicationAPI = {
  getAllJobApplications: () => api.get("/job-applications"),
  getJobApplicationById: (id) => api.get(`/job-applications/${id}`),
  createJobApplication: (data) => api.post("/job-applications", data),
  updateJobApplication: (id, data) => api.put(`/job-applications/${id}`, data),
  deleteJobApplication: (id) => api.delete(`/job-applications/${id}`),
  getJobApplicationsByUserId: (userId) =>
    api.get(`/job-applications/user/${userId}`),
  getJobApplicationsByJobPostId: (jobPostId) =>
    api.get(`/job-applications/job-post/${jobPostId}`),
};

export const jobPostAPI = {
  getAllJobPosts: () => api.get("/job-posts"),
  getJobPostById: (id) => api.get(`/job-posts/${id}`),
  createJobPost: (data) => api.post("/job-posts", data),
  updateJobPost: (id, data) => api.put(`/job-posts/${id}`, data),
  deleteJobPost: (id) => api.delete(`/job-posts/${id}`),
  getJobPostsByCreatedBy: (userId) =>
    api.get(`/job-posts/created-by/${userId}`),
};

export const formAPI = {

  // Form basics
  getAllForms: () => api.get("/forms"),
  getFormById: async (id) => {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },
  createForm: async (data) => {
    const response = await api.post("/forms", data);
    return response;
  },

  // Enhanced update method for step-by-step updates
  updateForm: (id, data) => api.put(`/forms/${id}`, data),

  // Section specific operations
  getFormSections: async (formId) => {
    const response = await api.get(`/forms/${formId}/sections`);
    return response.data;
  },
  createSection: async (formId, sectionData) => {
    // This now uses the updateForm method with only sections data
    const response = await api.put(`/forms/${formId}`, {
      sections: Array.isArray(sectionData) ? sectionData : [sectionData]
    });
    return response.data;
  },

  // Question specific operations
  getSectionQuestions: async (sectionId) => {
    const response = await api.get(`/forms/sections/${sectionId}/questions`);
    return response.data;
  },
  createQuestions: async (formId, questionsData) => {
    // This now uses the updateForm method with only questions data
    const response = await api.put(`/forms/${formId}`, {
      questions: questionsData
    });
    return response.data;
  },

  // Comprehensive form data with sections and questions
  getFormWithSections: async (id) => {
    const response = await api.get(`/forms/${id}/with-sections`);
    return response.data;
  },

  deleteForm: async (formId) => {
    const response = await api.delete(`/forms/${formId}`);
    return response.data;
  },
  getFormsByEventId: async (eventId) => {
    const response = await api.get(`/forms/event/${eventId}`);
    return response.data || response;
  },
  submitFormResponse: (formId, data) => api.post(`/forms/${formId}/responses`, data),
  getFormResponses: async (formId) => {
    const response = await api.get(`/forms/${formId}/responses`);
    return response.data;
  },
  getFormSummary: async (formId) => {
    const response = await api.get(`/forms/${formId}/summary`);
    return response.data;
  },
  getUserFormSubmissions: async (userId) => {
    const response = await api.get(`/forms/user-submissions/${userId}`);
    return response.data;
  },
};

export const certificationAPI = {
  getOwnCertifications: () => api.get("/certifications/me"),

  // Existing routes remain unchanged:
  getAllCertifications: () => api.get("/certifications"),
  getCertificationById: (id) => api.get(`/certifications/${id}`),
  getCertificationsByUserId: (userId) => api.get(`/certifications/user/${userId}`),
  createCertification: (data) => api.post("/certifications", data),
  updateCertification: (id, data) => api.put(`/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/certifications/${id}`),
  getCertNameSuggestions: (query) => api.get(`/certifications/suggestions/names?query=${query}`),
  getIssuerSuggestions: (query) => api.get(`/certifications/suggestions/issuers?query=${query}`),
};


export const educationAPI = {
  getOwnEducationHistory: () => api.get("/education-history/me"),

  // Existing routes remain unchanged:
  getAllEducationHistory: () => api.get("/education-history"),
  getEducationById: (id) => api.get(`/education-history/${id}`),
  getEducationByUserId: (userId) => api.get(`/education-history/user/${userId}`),
  createEducation: (data) => api.post("/education-history", data),
  updateEducation: (id, data) => api.put(`/education-history/${id}`, data),
  deleteEducation: (id) => api.delete(`/education-history/${id}`),
};


