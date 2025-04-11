import React from 'react';
import TenunImage from "../../assets/Tenun.jpg";
import KARYADILogo from "../../assets/KARYADI_Home.KARYADILogo1.png";

export default function AboutKaryadi() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat min-h-[700px] flex items-center"
      style={{
        backgroundImage: `url(${TenunImage})`,
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 text-center text-white">

      <div className="text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-10 inline-flex items-center justify-center gap-3 flex-wrap">
          About 
          <img 
            src={KARYADILogo} 
            alt="KARYADI Logo" 
            className="h-10 sm:h-12 w-auto object-contain" 
          />
        </h2>
      </div>

      
        <p className="text-lg sm:text-xl leading-relaxed mb-6 text-justify">
        <span className="font-semibold">KARYADI</span> is a dynamic subscription-based platform designed to drive talent readiness and participation in the digital economy through low-code/no-code solutions, data analytics, and sustainability technologies.
        </p>
        <p className="text-lg sm:text-xl leading-relaxed mb-10">
        Starting with Event App and Job Portal capabilities, it focuses on capacity-building training, digital transformation consulting, and agile outsourcing. KARYADI empowers businesses, gig workers, and digital talents to adapt and thrive in evolving markets.
        </p>
        <a
          href="/login"
          className="inline-block bg-[#d44e2c] hover:bg-[#b93e1b] text-white text-lg font-medium px-6 py-3 rounded-full shadow-md transition-all"
        >
          Join the KARYADI Community
        </a>
      </div>
    </section>
  );
}
