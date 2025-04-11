import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EventsVideo from "../components/events/EventVideo";
import EventsUpcoming from "../components/events/EventUpcoming";
import EventsHighlight from "../components/events/EventHighlight";
import EventsSearch from "../components/events/EventSearch";
import EventsCategory from "../components/events/EventCategory";
import EventsSubscription from "../components/events/EventSubscription";
import { eventsAPI } from "../utils/api";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchEvents();
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const fetchEvents = async () => {
    try {
      const eventsData = await eventsAPI.getAllEvents();
      const currentDate = new Date().toISOString().split("T")[0];
      const upcomingEvents = eventsData.data.filter(
        (event) => new Date(event.start_date) >= new Date(currentDate)
      );
      setEvents(eventsData.data);
      setFilteredEvents(upcomingEvents);
      setSearchResults(eventsData.data); // Initialize search results with all events
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen p-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-black min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <EventsVideo />
      </motion.div>

      <motion.div 
        className="mt-5 pt-8 border-t mx-8 border-gray-100 flex flex-col md:flex-row justify-between items-center"
        variants={itemVariants}
      />

      <motion.div variants={itemVariants}>
        <EventsUpcoming
          events={filteredEvents.slice(0, 3)}
          onEventClick={handleEventClick}
          loading={loading}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <EventsHighlight
          events={filteredEvents}
          onEventClick={handleEventClick}
          loading={loading}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <EventsSearch
          events={events}
          onSearchResults={setSearchResults}
          onEventClick={handleEventClick}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <EventsCategory />
      </motion.div>

      <motion.div variants={itemVariants}>
        <EventsSubscription />
      </motion.div>
    </motion.div>
  );
}
