import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import EventCards from "../components/events/EventCards";
import EventsHighlight from "../components/events/EventHighlight";
import { eventsAPI, attendanceAPI, formAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Main event states
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [userRSVPed, setUserRSVPed] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Add these new states for forms
  const [eventForms, setEventForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState({});
  const { user } = useAuth();

  // Add these new state variables with your other modal states
  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch event details and related events
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await eventsAPI.getEventById(id);
        setEvent(response.data);
        console.log("Event details:", response.data.slots);
        setAvailableSlots(response.data.slots || 0);

        const eventsData = await eventsAPI.getAllEvents();
        const currentDate = new Date().toISOString().split("T")[0];
        const upcomingEvents = eventsData.data.filter(
          (event) => new Date(event.start_date) >= new Date(currentDate)
        );
        setEvents(eventsData.data);
        setFilteredEvents(upcomingEvents);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  // Check RSVP status
  useEffect(() => {
    const fetchRSVPStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return;

        const response = await attendanceAPI.getAttendanceByUserAndEvent(
          user.id,
          id
        );
        setUserRSVPed(response.data?.attendance_status === "Yes, I'm going");
      } catch (error) {
        console.error("Error fetching RSVP status:", error);
      }
    };

    fetchRSVPStatus();
  }, [id]);

  // Add this effect to fetch forms for the current event
  useEffect(() => {
    const fetchEventForms = async () => {
      if (!id) return;

      setLoadingForms(true);
      try {
        console.log(`Fetching forms for event ID: ${id}`);
        const response = await formAPI.getFormsByEventId(id);
        console.log("Forms API response:", response);

        // Ensure we have an array of forms
        let forms = [];
        if (Array.isArray(response)) {
          forms = response;
        } else if (Array.isArray(response.data)) {
          forms = response.data;
        } else if (response && !Array.isArray(response)) {
          // If we got a single object, put it in an array
          forms = [response];
        }

        console.log("Processed forms array:", forms);
        // Sort forms by ID in ascending order
        forms.sort((a, b) => a.id - b.id);
        setEventForms(forms);

        // If user is logged in, fetch their submissions
        if (user?.id) {
          try {
            const userSubmissionsResponse = await formAPI.getUserFormSubmissions(user.id);
            const submissionsMap = {};

            if (Array.isArray(userSubmissionsResponse)) {
              userSubmissionsResponse.forEach(submission => {
                submissionsMap[submission.form_id] = true;
              });
            }

            setUserSubmissions(submissionsMap);
          } catch (error) {
            console.error("Error fetching user form submissions:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching event forms:", error);
      } finally {
        setLoadingForms(false);
      }
    };

    fetchEventForms();
  }, [id, user?.id]);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Function to update slots in the database
  // Replace the existing updateEventSlots function with this:
  const updateEventSlots = async (change) => {
    try {
      const newSlots = Math.max(availableSlots + change, 0); // Ensure slots don't go below 0

      // Use the new updateEventSlots endpoint
      await eventsAPI.updateEventSlots(id, newSlots);

      // Update local state
      setAvailableSlots(newSlots);
      setEvent((prev) => ({
        ...prev,
        slots: newSlots,
      }));
    } catch (error) {
      console.error("Error updating slots:", error);
      // Revert the local state if the API call fails
      setAvailableSlots((prev) => prev - change);
    }
  };

  const handleResponse = async (attendance_status) => {
    setIsOpen(false);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      console.error("User ID not found in localStorage");
      return;
    }

    try {
      const updatedFormData = {
        user_id: parseInt(user.id, 10),
        event_id: parseInt(id, 10),
        attendance_status,
      };

      const createdAttendance = await attendanceAPI.createAttendance(
        updatedFormData
      );
      setAttendance([...attendance, createdAttendance.data]);

      if (attendance_status === "Yes, I'm going") {
        setUserRSVPed(true);
        await updateEventSlots(-1); // Decrease available slots
      } else {
        setUserRSVPed(false);
      }

      setShowConfirmation(true);
    } catch (error) {
      console.error("Error creating attendance:", error);
    }
  };

  const handleCancelRSVP = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id || !id) return;

      await attendanceAPI.deleteAttendance(user.id, id);
      await updateEventSlots(1); // Increase available slots
      setUserRSVPed(false);
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Error canceling RSVP:", error);
    }
  };

  const formatLocationForMap = (location) => {
    if (!location) return "";
    return location.split(" ").join("+");
  };

  const handleRSVPClick = () => {
    if (!user) {
      setErrorMessage(
        <div className="flex items-center gap-2">
          Please{" "}
          <button
            onClick={() => navigate("/login", { state: { from: window.location.pathname } })}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            log in
          </button>{" "}
          to RSVP
        </div>
      );
      return;
    }
    setIsOpen(true);
  };

  // Update the handleFormClick function to check for submissions
  const handleFormClick = (formId) => {
    if (!user) {
      navigate("/login", { state: { from: `/forms/${formId}/submit` } });
      return;
    }

    // Check if user has already submitted this form
    if (userSubmissions[formId]) {
      setSelectedFormId(formId);
      setResubmitModalOpen(true);
    } else {
      navigate(`/forms/${formId}/submit`);
    }
  };

  // Add these handlers
  const handleResubmit = () => {
    setResubmitModalOpen(false);
    navigate(`/forms/${selectedFormId}/submit`);
  };

  const handleCancelResubmit = () => {
    setResubmitModalOpen(false);
    setSelectedFormId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading event details...</p>
        </motion.div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            <motion.div
              className="w-full md:w-2/4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src={event.image || "https://placehold.co/600x400"}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              className="w-full md:w-1/2 p-8"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl font-bold text-teal-600 mb-4"
              >
                {event.name}
              </motion.h1>

              <motion.div
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-start space-x-2">
                  <i className="fas fa-info-circle text-teal-600 mt-1"></i>
                  <p className="text-gray-700">{event.details}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <i className="fas fa-tag text-teal-600"></i>
                  <span className="text-[#d44e2c]">
                    {event.event_type} • {event.event_status}
                  </span>
                </div>

                {event.location_url && (
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-map-marker-alt text-[#d44e2c]"></i>
                    <a
                      href="#map"
                      className="text-teal-600 hover:text-[#d44e2c]"
                    >
                      {event.location_url}
                    </a>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <i className="fas fa-calendar-alt text-teal-600"></i>
                  <span className="text-gray-700">
                    {new Date(event.start_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span> <p>-</p>
                  <span className="text-gray-700">
                    {new Date(event.end_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {event.start_time && event.end_time && (
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-clock text-teal-600"></i>
                    <span className="text-gray-700">
                      {new Date(event.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(event.end_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}

                {event.virtual_link && (
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-video text-teal-600"></i>
                    <a href={event.virtual_link} className="text-teal-600 hover:text-[#d44e2c]">
                      Join Virtual Event
                    </a>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <i className="fas fa-user-friends text-[#d44e2c]"></i>
                  <p>Available slots:</p>
                  {availableSlots > 0 ? (
                    <span className="text-[#d44e2c]">{availableSlots}</span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Fully booked
                    </span>
                  )}
                </div>
              </motion.div>

              {/* RSVP Button */}
              {userRSVPed ? (
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel RSVP
                </button>
              ) : (
                <button
                  onClick={handleRSVPClick}
                  disabled={availableSlots === 0}
                  className={`mt-6 px-6 py-2 rounded-lg transition-colors ${availableSlots === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                    } text-white`}
                >
                  {availableSlots === 0 ? "Fully Booked" : "RSVP Now"}
                </button>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 text-red-600 font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Event Forms/Surveys Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Event Surveys
                </h2>

                {loadingForms ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  </div>
                ) : eventForms.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {eventForms.map(form => {
                      const hasSubmitted = userSubmissions[form.id];

                      return (
                        <motion.div
                          key={form.id}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleFormClick(form.id)}
                          className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md cursor-pointer flex justify-between items-center"
                        >
                          <div>
                            <h3 className="font-medium text-gray-900">{form.title}</h3>
                            {form.description && (
                              <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                            )}
                          </div>

                          <div className="flex items-center">
                            {hasSubmitted ? (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                Completed
                              </span>
                            ) : (
                              <span className="flex items-center text-teal-600">
                                Fill out
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 py-4">No surveys available for this event.</p>
                )}
              </motion.div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-lg p-6 w-80 shadow-xl"
                    >
                      <h2 className="text-xl font-bold mb-4 text-center">
                        Will you attend?
                      </h2>

                      <div className="space-y-3">
                        <button
                          onClick={() => handleResponse("Yes, I'm going")}
                          className="w-full py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                        >
                          Yes, I'm going
                        </button>

                        <button
                          onClick={() =>
                            handleResponse("Yes, I'm interested! Send me updates")
                          }
                          className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                        >
                          Yes, I'm interested! Send me updates
                        </button>

                        <button
                          onClick={() => setIsOpen(false)}
                          className="w-full py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showConfirmation && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-lg p-6 w-96 shadow-xl"
                    >
                      <h2 className="text-xl font-bold mb-4 text-center text-teal-600">
                        Thank you for RSVPing!
                      </h2>
                      <p className="text-center mb-6">
                        Your spot at{" "}
                        <span className="font-semibold">{event.name}</span> is
                        confirmed. We look forward to seeing you on{" "}
                        <span className="font-semibold">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        !
                      </p>
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="w-full py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                      >
                        Close
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showSubscription && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-lg p-6 w-96 shadow-xl"
                    >
                      <h2 className="text-xl font-bold mb-4 text-center text-yellow-600">
                        Thank you for subscribing!
                      </h2>
                      <p className="text-center mb-6">
                        You'll be the first to know about{" "}
                        <span className="font-semibold">{event.name}</span>{" "}
                        updates and news. Stay tuned for our next newsletter!
                      </p>
                      <button
                        onClick={() => setShowSubscription(false)}
                        className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      >
                        Close
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isConfirmOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-lg p-6 w-80 shadow-xl"
                    >
                      <h2 className="text-xl font-bold mb-4 text-center">
                        Are you sure?
                      </h2>
                      <p className="mb-4 text-center">
                        Do you really want to cancel your RSVP?
                      </p>

                      <div className="space-y-3">
                        <button
                          onClick={handleCancelRSVP}
                          className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Yes, cancel my RSVP
                        </button>

                        <button
                          onClick={() => setIsConfirmOpen(false)}
                          className="w-full py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          No, keep my RSVP
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {resubmitModalOpen && (
                  <>
                    {/* Fixed overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-50 z-40"
                      onClick={handleCancelResubmit} // Close when clicking outside
                    />

                    {/* Modal container */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="fixed inset-0 z-50 overflow-y-auto"
                      style={{ pointerEvents: 'none' }} // This allows clicks to pass through to either the backdrop or the modal content
                    >
                      <div className="flex items-center justify-center min-h-screen p-4">
                        {/* Actual modal */}
                        <div
                          className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full"
                          style={{ pointerEvents: 'auto' }} // This makes the modal itself clickable
                        >
                          <div className="p-6">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Submit Another Response</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                  You've already submitted a response for this form. Would you like to submit another response?
                                </p>
                              </div>
                            </div>

                            <div className="mt-6 flex flex-row-reverse gap-3">
                              <button
                                type="button"
                                onClick={handleResubmit}
                                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium"
                              >
                                Submit Again
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelResubmit}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Google Maps Section */}
          {event.location_url && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-6"
              id="map"
            >
              <h2 className="text-xl font-semibold mb-4">Event Location</h2>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="h-[450px] w-full rounded-lg overflow-hidden shadow-lg"
              >
                <iframe
                  width="100%"
                  height="600"
                  src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${formatLocationForMap(
                    event.location_url
                  )}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
                  title="Event Location"
                />
              </motion.div>
              <EventCards eventId={id} />
            </motion.div>
          )}
        </motion.div>
      </div>
      <EventsHighlight
        events={filteredEvents}
        onEventClick={handleEventClick}
        loading={loading}
      />
    </motion.div>
  );
};

export default EventDetails;
