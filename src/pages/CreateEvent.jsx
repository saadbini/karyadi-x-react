import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventsAPI } from "../utils/api";
import EventForm from "../components/forms/EventForm";
import AgendaForm from "../components/forms/AgendaForm";
import OrganizerForm from "../components/forms/OrganizerForm";
import PartnerForm from "../components/forms/PartnerForm";
import SponsorForm from "../components/forms/SponsorForm";
import CollaboratorForm from "../components/forms/CollaboratorForm";
import StepIndicator from "../components/forms/StepIndicator";
import toast from "react-hot-toast";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    image: "",
    location_url: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    event_type: "",
    event_status: "",
    slots: "",
    virtual_link: "",
  });
  const [eventId, setEventId] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await eventsAPI.getEventById(id);
          const event = response.data;

          const convertToHHMM = (dateString) => {
            const date = new Date(dateString);
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
          };

          setFormData({
            name: event.name || "",
            details: event.details || "",
            image: event.image || "",
            location_url: event.location_url || "",
            start_date: event.start_date ? event.start_date.split("T")[0] : "",
            end_date: event.end_date ? event.end_date.split("T")[0] : "",
            start_time: event.start_time ? convertToHHMM(event.start_time) : "",
            end_time: event.end_time ? convertToHHMM(event.end_time) : "",
            event_type: event.event_type || "",
            event_status: event.event_status || "",
            slots: event.slots || "",
            virtual_link: event.virtual_link || "",
          });
          setEventId(event.id);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };
      fetchEvent();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const getUserTimezoneOffset = () => {
      const offset = new Date().getTimezoneOffset();
      const absOffset = Math.abs(offset);
      const hours = Math.floor(absOffset / 60)
        .toString()
        .padStart(2, "0");
      const minutes = (absOffset % 60).toString().padStart(2, "0");
      const sign = offset <= 0 ? "+" : "-";
      return `${sign}${hours}:${minutes}`;
    };

    const formattedData = {
      ...formData,
      start_time: `${formData.start_date}T${
        formData.start_time
      }:00${getUserTimezoneOffset()}`,
      end_time: `${formData.start_date}T${
        formData.end_time
      }:00${getUserTimezoneOffset()}`,
    };

    try {
      if (eventId) {
        await eventsAPI.updateEvent(eventId, formattedData);
        setStep(2);
        toast.success("Event updated successfully");
      } else {
        const createdEvent = await eventsAPI.createEvent(formattedData);
        setEventId(createdEvent.data.id);
        setStep(2);
        toast.success("Event created successfully");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      if (error.response && error.response.status === 403) {
        toast.error("You do not have permission to perform this action");
      } else {
        toast.error("Failed to save event");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleFinish = () => {
    navigate("/events");
  };

  const handleBack = () => {
    navigate("/eventAdmin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="max-w-3l mx-auto">
            <div className="relative mb-8">
              <button
                onClick={handleBack}
                className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 19l-7-7 7-7"></path>
                </svg>
                Back
              </button>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {eventId ? "Edit Event" : "Create New Event"}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Complete the following steps to{" "}
                  {eventId ? "update" : "create"} your event
                </p>
              </div>
            </div>

            <div className="mb-8">
              <StepIndicator currentStep={step} />
            </div>

            <div className="transition-all duration-300 ease-in-out">
              {step === 1 && (
                <div className="animate-fadeIn">
                  <EventForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    isEditMode={!!eventId}
                  />
                </div>
              )}
              {step === 2 && (
                <div className="animate-fadeIn">
                  <AgendaForm
                    eventId={eventId}
                    setStep={setStep}
                    handlePrevious={handlePrevious}
                    handleFinish={handleFinish}
                  />
                </div>
              )}
              {step === 3 && (
                <div className="animate-fadeIn">
                  <OrganizerForm
                    eventId={eventId}
                    setStep={setStep}
                    handlePrevious={handlePrevious}
                    handleFinish={handleFinish}
                  />
                </div>
              )}
              {step === 4 && (
                <div className="animate-fadeIn">
                  <PartnerForm
                    eventId={eventId}
                    setStep={setStep}
                    handlePrevious={handlePrevious}
                    handleFinish={handleFinish}
                  />
                </div>
              )}
              {step === 5 && (
                <div className="animate-fadeIn">
                  <SponsorForm
                    eventId={eventId}
                    setStep={setStep}
                    handlePrevious={handlePrevious}
                    handleFinish={handleFinish}
                  />
                </div>
              )}
              {step === 6 && (
                <div className="animate-fadeIn">
                  <CollaboratorForm
                    eventId={eventId}
                    setStep={setStep}
                    handlePrevious={handlePrevious}
                    handleFinish={handleFinish}
                  />
                </div>
              )}
            </div>

            {/* <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={step === 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      step === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  Previous Step
                </button>
                {step === 5 && (
                  <button
                    onClick={handleFinish}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Finish
                  </button>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
