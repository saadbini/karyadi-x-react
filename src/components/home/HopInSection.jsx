import React, { useState } from "react";
import { Link } from 'react-router-dom';
import TenunImage1 from '../../assets/Tenun_1.jpg';
import TenunImage2 from '../../assets/Tenun_2.jpg';
import TenunImage3 from '../../assets/Tenun_3.jpg';

export default function HopInSection() {
  const cards = [
    {
      title: "TENUN Survey",
      url: "/forms",
      description: "With drag-and-drop interfaces and pre-built components, developers can create applications much faster than traditional coding methods, reducing time to market.",
      image: TenunImage1
    },
    {
      title: "Service Library Templates",
      url: "/",
      description: "Since development takes less time and requires fewer resources, the overall cost of building and maintaining applications is reduced.",
      image: TenunImage2
    },
    {
      title: "Ecommerce - Dagang Borneo",
      url: "/",
      description: "Outsystems supports integration with various third-party systems (APIs, databases, etc.), making it easier to incorporate into existing enterprise environments.",
      image: TenunImage3
    }
  ];

  return (
    <div className="bg-white pt-10 pb-10">
    <div className="max-w-[90%] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-6xl font-bold text-gray-900 mb-4">Hop in and start creating.</h2>
        <p className="text-3xl text-gray-500">Bring your talent, find your team.</p>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group relative rounded-3xl overflow-hidden cursor-pointer"
          >
            <div className="aspect-[4/4.5] relative">
              <Link to={card.url}>             
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                />
                <div className="absolute inset-0 bg-black/50 transition-opacity duration-300" />
    
                {/* Arrow icon */}
                <div className="absolute top-4 right-4 w-8 h-8">
                  <svg
                    className="w-6 h-6 transform rotate-45 transition-transform duration-300 text-white group-hover:text-[#d44e28]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12l7-7m0 0l7 7m-7-7v14"
                    />
                  </svg>
                </div>
    
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <div className="transform transition-all duration-300 translate-y-[calc(100%-3rem)] group-hover:translate-y-0">
                    <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  
  );
}
