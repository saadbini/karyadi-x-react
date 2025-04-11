import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { eventOrganizerAPI } from "../../utils/api";

const Organizers = () => {
  const { id } = useParams();
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const data = await eventOrganizerAPI.getOrganizersByEventId(id);
      setOrganizers(data.data);
      // console.log(data.data);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Organizers</h2>
      {organizers.length === 0 ? (
        <p className="text-gray-700 text-lg font-semibold text-center bg-gray-200 p-4 rounded-md">
          No organizers are added yet
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizers.map((organizer) => (
            <div
              key={organizer.id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-2">{organizer.Organization.name}</h3>
              <p className="text-gray-700">{organizer.Organization.description}</p>
              {organizer.is_main_organizer && (
                <span className="inline-block mt-2 px-3 py-1 bg-teal-600 text-white text-sm rounded-full">
                  Main Organizer
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Organizers;
