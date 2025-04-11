import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventsSearch({
  events = [],
  onSearchResults,
  onEventClick,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [displayedEvents, setDisplayedEvents] = useState([]);

  const handleSearch = () => {
    if (!searchTerm && !selectedMonth) {
      setDisplayedEvents([]);
      return;
    }

    const filteredEvents = events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.details.toLowerCase().includes(searchTerm.toLowerCase());

      if (selectedMonth && searchTerm) {
        const eventDate = new Date(event.date);
        const monthName = eventDate
          .toLocaleString("default", { month: "long" })
          .toLowerCase();
        return matchesSearch && monthName === selectedMonth.toLowerCase();
      }

      if (selectedMonth) {
        const eventDate = new Date(event.date);
        const monthName = eventDate
          .toLocaleString("default", { month: "long" })
          .toLowerCase();
        return monthName === selectedMonth.toLowerCase();
      }

      if (searchTerm) {
        return matchesSearch;
      }

      return false;
    });

    setDisplayedEvents(filteredEvents);
    onSearchResults(filteredEvents);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedMonth("");
    setDisplayedEvents([]);
    onSearchResults(events);
  };

  return (
    <div className="max-w-[90%] mx-auto py-16">
      <motion.div 
        className="bg-gradient-to-r from-[#DD4B25] to-[#c43d1b] text-white rounded-3xl p-8 lg:p-12 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          Looking for something specific?
        </h1>
        <p className="text-white/90 text-lg mb-8">
          Search through our events or filter by month to find exactly what you're looking for.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
              />
              <svg className="w-6 h-6 absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
          >
            <option value="">Filter by month</option>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
              <option key={month} value={month.toLowerCase()}>{month}</option>
            ))}
          </select>
          
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-white text-[#DD4B25] rounded-xl font-semibold hover:bg-white/90 transition-colors duration-300"
          >
            Search
          </button>
          
          {(searchTerm || selectedMonth) && (
            <button
              onClick={handleClear}
              className="px-8 py-4 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors duration-300"
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {displayedEvents.length > 0 && (
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white text-2xl font-bold mb-8">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => onEventClick(event.id)}
                  className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden cursor-pointer group hover:bg-white/10 transition-all duration-300"
                >
                  <div className="relative aspect-video">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#DD4B25] mb-2 group-hover:text-white transition-colors duration-300">
                      {event.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                      {event.details}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">
                        {new Date(event.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-[#DD4B25]">{event.event_type}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
