import React from 'react';
import SearchBar from './SearchBar';
import { motion } from 'framer-motion';

function Hero() {
  const popularCategories = [
    { name: 'Software Development', count: 150, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { name: 'Data Science', count: 89, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'UI/UX Design', count: 65, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Project Management', count: 45, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Digital Marketing', count: 78, icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' }
  ];

  return (
    <div className="relative">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-teal-50 to-white opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.6 }}
      />
      
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="block text-gray-900">Browse</span>
          <span className="block text-[#ff4d1c] mt-2">1000+ Job Openings</span>
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Unlock your <span className="text-[#00d4c8] font-semibold">career potential</span> - discover jobs that match your skills and aspirations.
        </motion.p>
        
        <motion.div 
          className="mt-12 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SearchBar />
        </motion.div>

        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-6">Popular Categories</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {popularCategories.map((category, index) => (
              <motion.button
                key={index}
                className="group px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <svg 
                    className="w-5 h-5 text-[#00d4c8] group-hover:text-[#ff4d1c] transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                  </svg>
                  <span className="text-gray-700 group-hover:text-[#ff4d1c] transition-colors">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({category.count})
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="mt-12 flex flex-wrap justify-center gap-4 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
            <span>Verified Employers</span>
          </motion.div>

          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
            <span>500+ Companies</span>
          </motion.div>

          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
            </svg>
            <span>89% Success Rate</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;