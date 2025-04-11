import React from "react";
import { motion } from "framer-motion";

export default function EventsCategory() {
  const categories = [
    {
      title: "Workshops",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80",
      description: "Interactive sessions focused on skill development",
    },
    {
      title: "Forum",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80",
      description: "Open discussions on industry trends and innovations",
    },
    {
      title: "Conference",
      image: "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&q=80",
      description: "Large-scale events featuring multiple speakers and tracks",
    },
    {
      title: "Seminar",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80",
      description: "Educational sessions with expert presentations",
    },
    {
      title: "Sales & Client\nFocused",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
      description: "Business networking and client relationship events",
    },
    {
      title: "CSR",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80",
      description: "Corporate social responsibility initiatives",
    },
    {
      title: "Product Launch",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80",
      description: "New product and service announcements",
    },
    {
      title: "Networking",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80",
      description: "Professional networking and community building",
    },
  ];

  return (
    <div className="bg-black py-16 lg:py-24">
      <div className="max-w-[90%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-white text-4xl font-bold mb-4">Categories at a Glance</h2>
          <p className="text-gray-400 text-lg">
            Explore our diverse range of event categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform duration-300">
                <motion.h3
                  className="text-white text-2xl font-bold mb-2 whitespace-pre-line"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                >
                  {category.title}
                </motion.h3>
                <motion.p
                  className="text-gray-300 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                >
                  {category.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
