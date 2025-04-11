import React, { useEffect } from "react";
import Hero from "../components/home/Hero";
import ParallaxComponent from "../components/home/ParallaxComponent";
import News from "../components/home/News";
import LevelUpSection from "../components/home/LevelUpSection";
import HopInSection from "../components/home/HopInSection";

export default function Home() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <ParallaxComponent />
      <News />
      <LevelUpSection />
      <HopInSection />
    </div>
  );
}
