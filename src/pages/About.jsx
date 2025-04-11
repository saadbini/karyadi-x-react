import React from 'react';
import Mission from '../components/about/Mission';
import Values from '../components/about/Values';
import AboutKaryadi from '../components/about/AboutKaryadi';

export default function About() {
  return (
    <div className="min-h-screen">
      <AboutKaryadi />
      <Mission />
      <Values />
    </div>
  );
}