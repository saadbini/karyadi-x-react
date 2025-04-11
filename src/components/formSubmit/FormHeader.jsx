import React from 'react';
import TapasImg from "../../assets/TapasAD1.png";
import MalaysiaTapasLogo from "../../assets/MalaysiaTapasLogo.png";
import SarawakTapasLogo from "../../assets/SarawakTapasLogo.png";

const FormHeader = ({ title, description }) => {
  return (
    <div className="relative w-full min-h-[22rem] md:min-h-[20rem] rounded-xl overflow-hidden shadow-md mb-10">
      <img 
        src={TapasImg} 
        alt="Tapas Banner" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30 flex flex-col items-center justify-center text-center px-4 pt-4">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-4">
          <img src={MalaysiaTapasLogo} alt="Malaysia Tapas Logo" className="max-h-20 md:max-h-24 w-auto max-w-full object-contain" />
          <img src={SarawakTapasLogo} alt="Sarawak Tapas Logo" className="max-h-20 md:max-h-24 w-auto max-w-full object-contain" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg break-words">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-white text-base md:text-lg max-w-2xl drop-shadow">
            {description}
          </p>
        )}
        <p>
          <span className="text-white text-sm font-semibold">Please complete all required fields.</span>
        </p>
      </div>
    </div>
  );
};

export default FormHeader;
