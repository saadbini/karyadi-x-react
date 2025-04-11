import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef(null);

  // Sample suggestions - replace with API call in production
  const suggestions = [
    'Software Engineer',
    'Product Manager',
    'UX Designer',
    'Data Scientist',
    'Project Manager'
  ].filter(s => s.toLowerCase().includes(query.toLowerCase()));

  const locationSuggestions = [
    'Brunei-Muara',
    'Tutong',
    'Belait',
    'Temburong',
    'Remote'
  ].filter(l => l.toLowerCase().includes(location.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e, suggestions, setValue, field) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && activeSuggestion !== -1) {
      setValue(suggestions[activeSuggestion]);
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto" ref={searchRef}>
      <motion.div 
        className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Job Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => handleKeyDown(e, suggestions, setQuery, 'query')}
            placeholder="Job title or keyword" 
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00d4c8] focus:ring-0 transition-colors"
          />
          <AnimatePresence>
            {showSuggestions && query && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    className={`px-4 py-2 cursor-pointer ${
                      index === activeSuggestion ? 'bg-teal-50 text-[#00d4c8]' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Location Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input 
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => handleKeyDown(e, locationSuggestions, setLocation, 'location')}
            placeholder="Location" 
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00d4c8] focus:ring-0 transition-colors"
          />
          <AnimatePresence>
            {showSuggestions && location && locationSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
              >
                {locationSuggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    className={`px-4 py-2 cursor-pointer ${
                      index === activeSuggestion ? 'bg-teal-50 text-[#00d4c8]' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setLocation(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Search Button */}
        <motion.button 
          className="bg-[#00d4c8] text-white px-8 py-3 rounded-xl hover:bg-[#00bfb3] transition-colors duration-300 font-semibold flex-shrink-0"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Search Jobs
        </motion.button>
      </motion.div>
    </div>
  );
}

export default SearchBar;