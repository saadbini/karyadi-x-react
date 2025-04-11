import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import karyadi from '../assets/KARYADI_Home.KARYADILogo1.png';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.img
            src={karyadi}
            alt="KARYADI Logo"
            className="mx-auto w-32 md:w-48 mb-8 select-none"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 backdrop-blur-lg border border-gray-100"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Coming Soon!
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              We're working hard to bring you an amazing job portal experience. 
              <div> Stay tuned! </div>
            </p>

            
            
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Return Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}