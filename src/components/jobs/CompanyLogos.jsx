import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function CompanyLogos() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="py-16">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4">
        Industry Leaders Trust Us
      </h2>

      <p className="text-center text-gray-600 text-lg mb-12">
        Join the growing community of top employers
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-50 transition-colors">
              <span className="text-gray-400 font-medium">Logo {i + 1}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-500">
          <span className="font-semibold text-gray-600">100+</span> companies actively hiring
        </p>
      </div>
    </div>
  );
}

export default CompanyLogos;