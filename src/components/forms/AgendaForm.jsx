import React, { useState, useEffect } from "react";
import { agendaAPI, eventsAPI, speakerAPI } from "../../utils/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AgendaForm({
  eventId,
  setStep,
  handlePrevious,
  handleFinish,
}) {
  const [agenda, setAgenda] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_time: "",
    end_time: "",
    slido_url: "",
  });
  const [eventDate, setEventDate] = useState("");
  const [timeError, setTimeError] = useState("");

  // States for editing agenda items
  const [editMode, setEditMode] = useState(false);
  const [editAgendaId, setEditAgendaId] = useState(null);

  // State for managing speakers
  const [speakers, setSpeakers] = useState({});
  const [showSpeakerForm, setShowSpeakerForm] = useState(false);
  const [speakerFormData, setSpeakerFormData] = useState({
    name: "",
    designation: "",
    description: "",
    image: "",
    agenda_id: null,
  });

  useEffect(() => {
    fetchEventDate();
    fetchAgendas();
  }, []);

  // This code is fetching the speakers for each agenda item
  useEffect(() => {
    if (agenda.length > 0) {
      agenda.forEach((item) => {
        if (item.showDescription) {
          fetchSpeakers(item.id);
        }
      });
    }
  }, [agenda]);

  const fetchEventDate = async () => {
    try {
      const response = await eventsAPI.getEventById(eventId);
      const event = response.data;
      setEventDate(event.date.split("T")[0]); // Extracting the date part
    } catch (error) {
      console.error("Error fetching event date:", error);
    }
  };

  // Fetch agendas for the current event
  const fetchAgendas = async () => {
    try {
      const data = await agendaAPI.getAgendasByEventId(eventId);
      setAgenda(data.data);
    } catch (error) {
      console.error("Error fetching agendas:", error);
    }
  };
  // Function to convert time to HH:mm format
  const convertToHHMM = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  // Functions for handling edit mode
  const handleEdit = (agenda) => {
    setFormData({
      name: agenda.name,
      description: agenda.description,
      start_time: convertToHHMM(agenda.start_time),
      end_time: convertToHHMM(agenda.end_time),
      slido_url: agenda.slido_url,
    });
    setEditMode(true);
    setEditAgendaId(agenda.id);
  };

  // Functions for speaker management
  // Fetch speakers for each agenda
  const fetchSpeakers = async (agendaId) => {
    try {
      const data = await speakerAPI.getSpeakersByAgendaId(agendaId);
      setSpeakers((prev) => ({ ...prev, [agendaId]: data.data }));
    } catch (error) {
      console.error("Error fetching speakers:", error);
      return null;
    }
  };

  const handleDeleteSpeaker = async (id, agendaId) => {
    try {
      const token = localStorage.getItem("token");
      await speakerAPI.deleteSpeaker(id, token);
      setSpeakers((prev) => ({
        ...prev,
        [agendaId]: prev[agendaId].filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting speaker:", error);
      alert("Failed to delete speaker");
    }
  };

  const handleAddSpeaker = (agendaId, e) => {
    e.stopPropagation();
    setShowSpeakerForm((prev) => !prev);
    setSpeakerFormData((prev) => ({
      ...prev,
      agenda_id: agendaId,
    }));
  };

  const handleSpeakerFormChange = (e) => {
    const { name, value } = e.target;
    setSpeakerFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpeakerFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const newSpeaker = await speakerAPI.createSpeaker(
        {
          ...speakerFormData,
          event_id: eventId,
        },
        token
      );
      setSpeakers((prev) => ({
        ...prev,
        [speakerFormData.agenda_id]: [
          ...(prev[speakerFormData.agenda_id] || []),
          newSpeaker.data,
        ],
      }));
      setShowSpeakerForm(false);
      setSpeakerFormData({
        name: "",
        designation: "",
        description: "",
        image: "",
        agenda_id: null,
      });
    } catch (error) {
      console.error("Error adding speaker:", error);
      alert("Failed to add speaker");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "start_time") {
      const newStartTime = new Date(`2000-01-01T${value}`);
      const currentEndTime = formData.end_time
        ? new Date(`2000-01-01T${formData.end_time}`)
        : null;

      if (currentEndTime && newStartTime > currentEndTime) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          end_time: "",
        }));
        return;
      }
    }

    if (name === "end_time" && formData.start_time) {
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(`2000-01-01T${value}`);

      if (endTime <= startTime) {
        setTimeError("End time must be after start time");
        return;
      } else {
        setTimeError("");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Function to get the user's timezone offset
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

      // Format the data before sending it to the API
      const formattedData = {
        ...formData,
        start_time: `${eventDate}T${
          formData.start_time
        }:00${getUserTimezoneOffset()}`,
        end_time: `${eventDate}T${
          formData.end_time
        }:00${getUserTimezoneOffset()}`,
        event_id: eventId,
      };

      if (editMode) {
        await agendaAPI.updateAgenda(editAgendaId, formattedData);
        setEditMode(false);
        setEditAgendaId(null);
      } else {
        const createdAgenda = await agendaAPI.createAgenda(
          formattedData,
          token
        );
        setAgenda([...agenda, createdAgenda.data]);
      }

      setFormData({
        name: "",
        description: "",
        start_time: "",
        end_time: "",
        slido_url: "",
      });
      fetchAgendas(); // Fetch updated list of agendas
    } catch (error) {
      console.error("Error creating/updating agenda:", error);
      alert("Failed to create/update agenda");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await agendaAPI.deleteAgenda(id, token);
      setAgenda(agenda.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting agenda:", error);
      alert("Failed to delete agenda");
    }
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, description: value }); // Directly update the state with the Quill content
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {editMode ? "Edit Agenda" : "Add Agenda"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <ReactQuill
            value={formData.description || ""}
            onChange={handleEditorChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
            theme="snow" // The 'snow' theme for the Quill editor
          />
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label
              htmlFor="start_time"
              className="block text-sm font-medium text-gray-700"
            >
              Start Time
            </label>
            <input
              type="time"
              name="start_time"
              id="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
              required
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="end_time"
              className="block text-sm font-medium text-gray-700"
            >
              End Time
            </label>
            <input
              type="time"
              name="end_time"
              id="end_time"
              value={formData.end_time}
              onChange={handleChange}
              min={formData.start_time}
              disabled={!formData.start_time}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            {timeError && (
              <p className="mt-1 text-sm text-red-600">{timeError}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="slido_url"
            className="block text-sm font-medium text-gray-700"
          >
            Slido URL
          </label>
          <input
            type="url"
            name="slido_url"
            id="slido_url"
            value={formData.slido_url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50"
        >
          {editMode ? "Edit Agenda" : "Add Agenda"}
        </button>
      </form>
      <div className="mt-6">
        {/* Listing the added agenda items */}
        <h3 className="text-lg font-medium mb-2">Added Agenda Items</h3>
        <ul className="space-y-4">
          {[...agenda]
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
            .map((item) => (
              <li
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div
                    className="cursor-pointer flex-grow"
                    onClick={() => {
                      setAgenda(
                        agenda.map((agendaItem) =>
                          agendaItem.id === item.id
                            ? {
                                ...agendaItem,
                                showDescription: !agendaItem.showDescription,
                              }
                            : agendaItem
                        )
                      );
                    }}
                  >
                    <h4 className="font-medium text-gray-800 text-lg mb-4">
                      {item.name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-items-center">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Start:</span>
                        <span>
                          {new Date(item.start_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">End:</span>
                        <span>
                          {new Date(item.end_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {item.slido_url && (
                        <a
                          href={item.slido_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 inline-flex items-center space-x-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Open Slido</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                    {item.showDescription && (
                      <>
                        <hr className="my-6 border-gray-200" />
                        <div className="mt-4 p-3">
                          <div
                            className="text-gray-700 list-disc list-inside"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>

                        <div
                          className="mt-4 p-3 bg-gray-100 rounded-md"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h5 className="text-sm font-medium mb-2">Speakers</h5>
                          <ul className="list-none text-sm text-gray-600">
                            {(speakers[item.id] || []).map((speaker) => (
                              <li
                                key={speaker.id}
                                className="bg-white p-2 rounded-md mb-2 cursor-pointer"
                                onClick={() =>
                                  setSpeakers((prev) => ({
                                    ...prev,
                                    [item.id]: prev[item.id].map((s) =>
                                      s.id === speaker.id
                                        ? {
                                            ...s,
                                            showDescription: !s.showDescription,
                                          }
                                        : s
                                    ),
                                  }))
                                }
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-bold">
                                    {speaker.name}
                                  </span>
                                  <span>{speaker.designation}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent collapsing the agenda item
                                      handleDeleteSpeaker(speaker.id, item.id);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                {speaker.showDescription && (
                                  <p className="text-gray-700 mt-2">
                                    {speaker.description}
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={(e) => handleAddSpeaker(item.id, e)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            {showSpeakerForm &&
                            speakerFormData.agenda_id === item.id
                              ? "Cancel Adding Speaker"
                              : "Add Speaker"}
                          </button>
                          {showSpeakerForm &&
                            speakerFormData.agenda_id === item.id && (
                              <form
                                onSubmit={handleSpeakerFormSubmit}
                                className="mt-4 space-y-4"
                              >
                                <div>
                                  <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={speakerFormData.name || ""}
                                    onChange={handleSpeakerFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
                                    required
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="designation"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Designation
                                  </label>
                                  <input
                                    type="text"
                                    name="designation"
                                    id="designation"
                                    value={speakerFormData.designation || ""}
                                    onChange={handleSpeakerFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
                                    required
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Description
                                  </label>
                                  <textarea
                                    name="description"
                                    id="description"
                                    value={speakerFormData.description || ""}
                                    onChange={handleSpeakerFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="image"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Image URL
                                  </label>
                                  <input
                                    type="text"
                                    name="image"
                                    id="image"
                                    value={speakerFormData.image || ""}
                                    onChange={handleSpeakerFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                  Save Speaker
                                </button>
                              </form>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                    className="ml-4 p-2 text-blue-500 hover:text-blue-700 focus:outline-none transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="ml-4 p-2 text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <hr className="my-6 border-gray-200" />

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setStep(3)}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Next: Add Organizer
        </button>
        <button
          onClick={handleFinish}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
