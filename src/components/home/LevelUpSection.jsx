import React, { useState } from "react";

export default function LevelUpSection() {
  const items = [
    {
      title: "LMS",
      description: "Our Learning Management System provides a comprehensive platform for online education, featuring interactive courses, progress tracking, and collaborative learning tools."
    },
    {
      title: "Outsystems",
      description: "OutSystems is a low-code platform that lets users build apps quickly with minimal coding. It uses a drag-and-drop interface for both web and mobile app development. The platform is known for its speed and simplicity, making it popular for business apps."
    },
    {
      title: "Courses",
      description: "Access a wide range of professional development courses designed to enhance your skills and advance your career in technology and digital transformation."
    }
  ];

  return (
    <div className="bg-white pt-10">
      <div className="max-w-[100%] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Level up with your crew.</h2>
          <p className="text-3xl text-gray-500">Share ideas, pick up skills, grow together as a community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative bg-gray-50 hover:bg-[#DD4B25] rounded-lg p-8 h-[400px] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden"
            >
              {/* Title */}
              <h3
                className="text-4xl font-bold text-gray-900 group-hover:text-white mb-4 transition-colors duration-300 leading-normal flex items-center justify-center h-10"
              >
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text group-hover:text-white opacity-0 group-hover:opacity-100 translate-y-96 group-hover:translate-y-0 transition-all duration-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}
