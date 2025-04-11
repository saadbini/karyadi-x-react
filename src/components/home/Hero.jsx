import React, { useState, useEffect } from "react";
import { HeroTitle } from "./HeroTitle";
import { HeroDescription } from "./HeroDescription";
import { HeroButtons } from "./HeroButtons";
import sample1 from "../../assets/pic_sample1.jpg";
import sample2 from "../../assets/pic_sample2.png";
import adImg1 from "../../assets/temp_placeholder.png";
import adImg2 from "../../assets/TapasAD1.png";
import adImg3 from "../../assets/TapasAD2.jpg";

export default function Hero() {
  const stats = [
    { id: "projectNumber", target: 500, label: "Projects and opportunities for digital talents" },
    { id: "talentNumber", target: 1000, label: "Digital talents in the community — and constantly growing" },
    { id: "collaborationNumber", target: 200, label: "Successful collaborations for projects" },
  ];

  const [counts, setCounts] = useState(stats.reduce((acc, stat) => ({ ...acc, [stat.id]: 0 }), {}));

  // Function to animate number increment
  const animateNumber = (id, target) => {
    let count = 0;
    const step = Math.ceil(target / 100);
    const incrementSpeed = 10;

    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        setCounts((prev) => ({ ...prev, [id]: target }));
        clearInterval(interval);
      } else {
        setCounts((prev) => ({ ...prev, [id]: count }));
      }
    }, incrementSpeed);
  };

  useEffect(() => {

    
    const observers = [];

    stats.forEach(({ id, target }) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animateNumber(id, target);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-animate]");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );
  
    elements.forEach((el) => observer.observe(el));
  
    return () => observer.disconnect();
  }, []);
  

  return (
    <>
      {/* Hero Section - Dual Ad Banners */}
      <div
      className="w-full px-2 mt-4 opacity-0 translate-y-10 transition-all duration-1000 ease-in-out"
      data-animate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdSpace
          title={
            <>
              Event Survey: <br />World TAPAS Competition 2025
            </>
          }
          image={adImg3}
          description="Join our survey and enjoy a voucher from your favorite vendor - your pick, your reward!"
          link="/forms/14/submit"
        />
        <AdSpace
          title={
            <>
              Vendor Survey: <br />World TAPAS Competition 2025
            </>
          }
          image={adImg2}
          description="Complete this short survey upon entry and enjoy the ultimate Tapas showdown!"
          link="/forms/13/submit"
        />
      </div>
    </div>



      {/* Content Section */}
      <section className="min-h-screen bg-white p-4 sm:p-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hey, Digital Talents - This is Your Space.
          </h1>
          <p className="text-xl text-gray-500">
            Find your people, share ideas, and create amazing things together.
          </p>
        </div>

        {/* 🆕 Full-width Grid Layout for Testimonials & Ads */}
        <div
        className="w-full container mx-auto px-6 lg:px-16 opacity-0 translate-y-10 transition-all duration-1000 ease-in-out"
        data-animate
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* 🏆 Testimonials - Now taking 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              {[
                {
                  img: sample1,
                  quote:
                    "The digital economy is more than just technology—it's a thriving ecosystem of creators, thinkers, and problem-solvers...",
                  name: "Aisha R.",
                  role: "UX Designer & Freelancer",
                  projects: "40+ Successful Projects",
                },
                {
                  img: sample2,
                  quote:
                    "When I left my corporate job to join the gig economy, I thought I'd be working alone. But what I found instead was a community...",
                  name: "Darren K.",
                  role: "Startup Founder & Digital Nomad",
                  projects: "100+ Successful Projects",
                },
              ].map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>

            {/* 📢 Ad Spaces - Bigger and More Prominent
            <div className="flex flex-col gap-8">
              <AdSpace 
                 title={
                  <>
                    Event Survey: <br />World TAPAS Competition
                  </>
                 } 
                image={adImg3} 
                description="Complete this short survey upon entry and enjoy the ultimate Tapas showdown!" 
                link="/forms/13/submit"
              />
              <AdSpace 
                title={
                  <>
                    Vendor Survey: <br />World TAPAS Competition
                  </>
                 } 
                image={adImg2} 
                description="Join our survey and enjoy a voucher from your favorite vendor - your pick, your reward!" 
                link="/forms/14/submit"
              />
            </div> */}

            {/* 📢 Merged Ad Space (Slide-Up Description Style) */}
            <div
              className="group relative w-full rounded-2xl overflow-hidden cursor-pointer bg-cover bg-center bg-no-repeat min-h-[300px] sm:min-h-[350px] shadow-lg"
              style={{ backgroundImage: `url(${adImg3})` }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/60" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                <div className="transform transition-all duration-300 translate-y-[calc(100%-4rem)] group-hover:translate-y-0">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 break-words leading-tight">
                    World TAPAS Competition 2025 🍽️
                  </h3>
                  <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm leading-snug">
                    Two awesome surveys, one flavorful experience! Contribute as an event guest or vendor and enjoy exclusive rewards.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-[#E5E0E0]">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                This is where it happens.
              </h1>
              <p className="text-xl text-gray-600">Creators and projects, all in one place.</p>
            </div>

            <div className="md:w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {stats.map(({ id, label }) => (
                <StatCard key={id} id={id} number={counts[id]} label={label} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const TestimonialCard = ({ img, quote, name, role, projects }) => (
  // <div className="bg-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-12">
  <div className="bg-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-12 min-h-[300px]">
    <div className="flex flex-col md:flex-row items-center gap-5">
      <div className="w-full md:w-1/3">
        <img src={img} alt={name} className="w-full rounded-lg object-cover" />
      </div>
      <div className="w-full md:w-2/3">
        <p className="text-gray-600">{quote}</p>
        <h2 className="text-2xl font-bold text-[#d44e2c] mt-4">{name}</h2>
        <p className="text-gray-600">{role}</p>
        <p className="text-gray-500">{projects}</p>
      </div>
    </div>
  </div>
);


const AdSpace = ({ title, image, description, link }) => {
  if (!link) {
    console.error(`🚨 Missing "link" prop for AdSpace: ${title}`);
  }

  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <div
        className="group relative rounded-2xl overflow-hidden cursor-pointer bg-cover bg-center bg-no-repeat aspect-[4/3] sm:min-h-[300px]"
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/60" />

        {/* Arrow Icon */}
        <div className="absolute top-4 right-4 w-8 h-8 z-10">
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

        {/* Content with Slide-Up Hover Effect */}
        <div className="absolute inset-x-0 bottom-0 p-6 z-10">
          <div className="transform transition-all duration-300 translate-y-[calc(100%-3.5rem)] group-hover:translate-y-0">
            <h3 className="text-2xl font-bold text-white mb-3 break-words leading-tight">
              {title}
            </h3>
            <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm leading-snug">
              {description}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
};





const StatCard = ({ id, number, label }) => (
  <div
    id={id}
    className="group bg-white text-gray-900 hover:text-white rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between min-h-[200px] sm:h-80 transition-all duration-300 transform hover:bg-[#d44e2c] hover:translate-y-3"
  >
    <h2 className="text-5xl font-bold mb-4 group-hover:mt-auto">{number}+</h2>
    <p className="text-base">{label}</p>
  </div>
);





