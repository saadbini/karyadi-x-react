import React from "react";
import { motion } from "framer-motion";

export default function EventsUpcoming({ events = [], onEventClick, loading }) {
  if (loading) {
    return (
      <div className="text-white text-center py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        </motion.div>
      </div>
    );
  }

  const [mainEvent, ...sideEvents] = events;

  return (
    <div className="bg-black text-white font-sans p-8 lg:p-16">
      <motion.h2 
        className="text-4xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Upcoming Events
      </motion.h2>
      
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Column 1 - Main Event */}
        {mainEvent && (
          <motion.div
            className="flex flex-col cursor-pointer"
            onClick={() => onEventClick(mainEvent.id)}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative h-full rounded-2xl overflow-hidden group">
              <motion.img
                src={mainEvent.image || "https://via.placeholder.com/800x600"}
                alt={mainEvent.name}
                className="object-cover w-full h-full rounded-2xl"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex flex-col space-y-4">
                  <motion.h3 
                    className="text-[#d44e28] text-3xl md:text-4xl font-bold"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {mainEvent.name}
                  </motion.h3>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <div className="flex flex-col">
                        <span className="text-sm">{new Date(mainEvent.start_date).toLocaleDateString("en-GB", { weekday: "long" })}</span>
                        <span className="text-lg font-semibold">
                          {new Date(mainEvent.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm break-words max-w-[200px]">{mainEvent.location_url}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Column 2 - Side Events */}
        <div className="flex flex-col justify-between space-y-8">
          {sideEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                sideEvents.length === 1 ? 'h-full' : 'h-[350px]'
              }`}
              onClick={() => onEventClick(event.id)}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.img
                src={event.image || "https://via.placeholder.com/400x300"}
                alt={event.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity duration-300`} />
              
              <div className={`absolute bottom-5 left-0 right-0 p-6 ${
                sideEvents.length === 1 ? 'p-8' : 'p-6'
              }`}>
                <h3 className={`font-bold text-white group-hover:text-[#d44e28] transition-colors duration-300 ${
                  sideEvents.length === 1 ? 'text-3xl md:text-4xl mb-4' : 'text-2xl'
                }`}>
                  {event.name}
                </h3>
                {sideEvents.length === 1 ? (
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <div className="flex flex-col">
                        <span className="text-sm">{new Date(event.start_date).toLocaleDateString("en-GB", { weekday: "long" })}</span>
                        <span className="text-lg font-semibold">
                          {new Date(event.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm break-words max-w-[200px]">{event.location_url}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/80 mt-2">
                    {new Date(event.start_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
