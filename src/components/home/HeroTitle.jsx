import React from 'react';
import { HERO_TEXT } from '../../utils/constants';

export function HeroTitle() {
  console.log("HERO_TEXT:", HERO_TEXT); // Debugging step

  return (
    <div className="text-center">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold">
        {HERO_TEXT.TITLE_LINES?.map((line, index) => (
          <div key={index} className="leading-tight">
            {line}
          </div>
        ))}
      </h1>

      
      {/* {HERO_TEXT.DESCRIPTION && ( // Prevents errors if DESCRIPTION is undefined
        <p className="text-lg md:text-xl lg:text-2xl text-white mt-4 max-w-3xl mx-auto">
          {HERO_TEXT.DESCRIPTION}
        </p>
      )} */}
    </div>
  );
}
