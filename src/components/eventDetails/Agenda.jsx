import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { agendaAPI, speakerAPI } from "../../utils/api";

const Agenda = () => {
  const { id } = useParams();
  const [agenda, setAgenda] = useState([]);
  const [speakers, setSpeakers] = useState({});

  useEffect(() => {
    fetchAgendas();
  }, []);

  const [openAgenda, setOpenAgenda] = useState(null);

  const toggleCollapse = (id, hasContent) => {
    if (!hasContent) return; // Prevent collapsing if there's no content
    setOpenAgenda(openAgenda === id ? null : id);
  }

  const fetchAgendas = async () => {
    try {
      const data = await agendaAPI.getAgendasByEventId(id);
      const sortedAgendas = data.data.sort(
        (a, b) => new Date(a.start_time) - new Date(b.start_time)
      );
      setAgenda(sortedAgendas);
      sortedAgendas.forEach((item) => fetchSpeakers(item.id));
    } catch (error) {
      console.error("Error fetching agendas:", error);
    }
  };

  const fetchSpeakers = async (agendaId) => {
    try {
      const data = await speakerAPI.getSpeakersByAgendaId(agendaId);
      setSpeakers((prev) => ({ ...prev, [agendaId]: data.data }));
    } catch (error) {
      console.error("Error fetching speakers:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Agenda</h2>
      {agenda.map((item) => {
        const hasDescription = item.description?.trim() !== "";
        const hasSpeakers = speakers[item.id] && speakers[item.id].length > 0;
        const isCollapsible = hasDescription || hasSpeakers;
        const isOpen = openAgenda === item.id;

        return (
          <div key={item.id} className="mb-6 p-4 bg-white rounded-lg shadow-md">
            {/* Clickable Header (Title + Time) */}
            <div
              className={`flex justify-between items-center cursor-pointer ${
                isCollapsible ? "hover:bg-gray-100 p-2 rounded" : ""
              }`}
              onClick={() => toggleCollapse(item.id, isCollapsible)}
            >
              <div>
                <h3 className="text-xl font-semibold text-teal-600">
                  {item.name}
                </h3>
                <p className="text-gray-500">
                  {new Date(item.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(item.end_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {isCollapsible && (
                <span className="text-gray-500">{isOpen ? "▲" : "▼"}</span>
              )}
            </div>

            {/* Collapsible Content */}
            {isOpen && (
              <div className="mt-4 pl-2"> {/* Add left padding for alignment */}
                {hasDescription && (
                <p
                className="text-gray-700 list-disc list-inside"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
              
               
                )}
                {hasSpeakers && (
                  <>
                    <h4 className="text-lg font-semibold my-4">Speakers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {speakers[item.id].map((speaker) => (
                        <div
                          key={speaker.id}
                          className="p-4 bg-gray-100 rounded-lg shadow-sm"
                        >
                          <h5 className="text-md font-semibold">{speaker.name}</h5>
                          <p className="text-gray-700">{speaker.designation}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Agenda;
