import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { eventsAPI } from "../../utils/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import adImg2 from "../../assets/TapasAD1.png";
import adImg3 from "../../assets/TapasAD2.jpg";

const AdSpace = ({ title, image, description, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-cover bg-center bg-no-repeat h-[500px]"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/60" />
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


export default function News() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsData = await eventsAPI.getAllEvents();
      const currentDate = new Date().toISOString().split("T")[0];
      const upcomingEvents = eventsData.data.filter(
        (event) => new Date(event.start_date) >= new Date(currentDate)
      );
      setEvents(upcomingEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (loading) {
    return <div className="text-white text-center py-8">Loading events...</div>;
  }

  return (
    <div className="bg-black py-12">
      <div className="max-w-[90%] mx-auto">

        {/* 🎯 Ad Section Below Events */}
        <div className="mt-12">
            <h3 className="text-white text-3xl font-bold mb-6">🔥 Featured Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AdSpace
                title="Get Ready for TAPAS 2024"
                image={adImg3}
                description="A culinary tech celebration like no other. Register now and secure your spot!"
                link="/events/tapas-2024"
              />
              <AdSpace
                title="Digital Bootcamp Series"
                image={adImg3}
                description="Level up your skills with our digital bootcamps — designed for creatives and coders."
                link="/events/bootcamp-series"
              />
              <AdSpace
                title="Calling All Vendors!"
                image={adImg2}
                description="Be part of the biggest food-tech showcase in Borneo. Limited slots available!"
                link="/vendors/signup"
              />
            </div>
          </div>

          <div className="mt-20"> 
          <h2 className="text-white text-4xl font-bold mb-8">Events</h2>
                  <Slider {...settings} className="events-slider">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="px-2"
                        onClick={() => handleEventClick(event.id)}
                      >
                        <div className="relative group cursor-pointer">
                          <img
                            src={event.image || "https://via.placeholder.com/400x500"}
                            alt={event.name}
                            className="w-full h-[500px] object-cover rounded-lg transition-all duration-300 group-hover:brightness-75"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                            <h3 className="text-white text-2xl font-bold transition-transform transform group-hover:translate-y-[-10px]">
                              {event.name}
                            </h3>
                            <p className="text-[#d44e28] text-lg transition-transform transform group-hover:translate-y-[-10px] opacity-0 group-hover:opacity-100">
                              {new Date(event.start_date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>

                </div>
              </div>
          </div>
  );
}
