import React from 'react';

export default function Mission() {
  return (
    <section className="relative bg-[#f9fafb] py-20 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Title */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
          Our <span className="text-[#d44e2c]">Mission</span>
        </h2>

        {/* Vertical Accent Line */}
        <div className="mx-auto w-16 h-1 bg-[#d44e2c] rounded-full mb-6" />

        {/* Mission Text */}
        <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed tracking-wide">
          To connect talented individuals with innovative companies, 
          creating meaningful career opportunities and fostering professional growth.
        </p>
      </div>
    </section>
  );
}
