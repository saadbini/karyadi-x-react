import React from "react";
import { Link } from "react-router-dom";
import TenunImage5 from "../../assets/Tenun_5.jpg";
import TenunImage6 from "../../assets/Tenun_6.jpg";
import TenunImage7 from "../../assets/Tenun_7.jpg";
import TenunImage8 from "../../assets/Tenun_8.jpg";
import TenunImage9 from "../../assets/Tenun_9.jpg";

const Card = ({ image, title, description, link }) => (
  <Link
    to={link}
    className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
  >
    <div className="relative w-full h-64 overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
      />
    </div>
    <div className="absolute inset-0 flex flex-col justify-end p-4">
      <h3 className="text-white text-lg font-bold mb-2">{title}</h3>
      <p className="text-white text-sm">{description}</p>
    </div>
    <div className="absolute top-4 right-4 bg-[#d44e28] rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </Link>
);

const EventCards = ({ eventId }) => {
  const cards = [
    {
      image: TenunImage5,
      title: "Agenda",
      description:
        "Explore key topics, gain insights, and connect with experts at today’s event!",
      link: `/events/agenda/${eventId}`,
    },
    {
      image: TenunImage8,
      title: "Speakers",
      description:
        "Meet our speakers: experts in their fields, ready to share insights and inspire innovation.",
      link: `/events/speakers/${eventId}`,
    },
    {
      image: TenunImage9,
      title: "Attendees",
      description:
        "Join us for an unforgettable experience! Network, learn, and engage with fellow attendees.",
      link: `/events/attendees/${eventId}`,
    },
    {
      image: TenunImage6,
      title: "Organizers",
      description:
        "Get to know the organizers behind the event: the head organizer, who leads the vision.",
      link: `/events/organizers/${eventId}`,
    },
    {
      image: TenunImage7,
      title: "Sponsors & Partners",
      description:
        "Meet our sponsors and partners: industry leaders driving change. Connect with them.",
      link: `/events/sponsors/${eventId}`,
    },
  ];

  return (
    <div className="mt-5">
      <h2 className="text-xl font-semibold mb-4">Explore Event</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            image={card.image}
            title={card.title}
            description={card.description}
            link={card.link}
          />
        ))}
      </div>
    </div>
  );
};

export default EventCards;
