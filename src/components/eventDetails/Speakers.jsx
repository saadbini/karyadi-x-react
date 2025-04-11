import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { speakerAPI } from "../../utils/api";
import speakerPlaceholder from "../../assets/speaker.png";

const Speakers = () => {
  const { id } = useParams();
  const [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    fetchSpeakersByEventId();
  }, []);

  const fetchSpeakersByEventId = async () => {
    try {
      const response = await speakerAPI.getSpeakersByEventId(id);
      // Filter unique speakers by name, keeping only the first occurrence
      const uniqueSpeakers = response.data.reduce((acc, current) => {
        const isDuplicate = acc.find((item) => item.name === current.name);
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      const sortedSpeakers = uniqueSpeakers.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setSpeakers(sortedSpeakers);
    } catch (error) {
      console.error("Error fetching speakers by event ID:", error);
    }
  };

  const handleCardClick = (speakerId) => {
    setSpeakers((prevSpeakers) =>
      prevSpeakers.map((speaker) =>
        speaker.id === speakerId
          ? { ...speaker, showDescription: !speaker.showDescription }
          : speaker
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Event Speakers</h2>
      </div>
      
      {speakers.length === 0 ? (
        <p className="text-gray-700 text-lg font-semibold text-center bg-gray-200 p-4 rounded-md">
          No speakers are added yet
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className="group relative bg-white rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl cursor-pointer overflow-hidden transform hover:-translate-y-1 flex flex-col w-full max-w-[280px] mx-auto"
              onClick={() => handleCardClick(speaker.id)}
            >
              {/* Overlay Description */}
              <div 
                className={`absolute inset-0 bg-black/80 z-10 transition-all duration-300 flex items-center justify-center p-6 ${
                  speaker.showDescription ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(speaker.id);
                }}
              >
                <p className="text-white text-sm overflow-y-auto max-h-full">
                  {speaker.description}
                </p>
              </div>

              <div className="relative">
                <div className="bg-[#d44e2c] pt-2 px-2 pb-12 rounded-t-2xl">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                    <img
                      src={speaker.image || speakerPlaceholder}
                      alt={speaker.name}
                      className="w-full h-full object-cover bg-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20"></div>
                  </div>
                </div>
                <div className="absolute -bottom-5 left-0 w-[150%] h-20 bg-white transform -rotate-12"></div>
              </div>

              <div className="px-6 pt-6 pb-4 text-right relative flex-grow">
                <div className="absolute top-3 right-6 w-12 h-0.5 bg-[#d44e2c] transition-all duration-300 group-hover:bg-white"></div>
                <h3 className="text-xl font-semibold mb-1 transition-colors duration-300 group-hover:text-[#d44e2c]">
                  {speaker.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {speaker.designation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Speakers;
