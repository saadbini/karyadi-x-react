import React from 'react';
import { HERO_TEXT } from '../../utils/constants';

export function HeroDescription() {
  return (
    <p className="text-base md:text-lg lg:text-xl mb-8">
      {HERO_TEXT.DESCRIPTION}
    </p>
  );
}