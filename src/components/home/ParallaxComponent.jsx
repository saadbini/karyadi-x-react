import React, { useState, useEffect } from 'react'; // Added useState and useEffect
import parallax from "../../assets/parallax.png"; // Correctly importing the image
export default function ParallaxComponent() {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <div>
      <div
        style={{
          position: 'relative', // Set relative position for the container
          backgroundImage: `url(${parallax})`,
          height: '100vh',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Overlay text and button */}
        <div
        className="opacity-0 translate-y-10 transition-all duration-1000 ease-in-out"
        data-animate
        style={{
          textAlign: 'center',
          color: 'black',
          padding: '20px',
          borderRadius: '10px',
        }}
        >

          <h1 style={{ fontSize: '2.5rem', margin: '0', fontWeight: 'bold' }}>
            An ever-growing community of Digital Talents.
          </h1>

          <p style={{ fontSize: '1.25rem', margin: '10px 0' }}>Start collaborating with like-minded talents and make an impact</p>
          <a href="https://dagangborneo.com/" target="_blank" rel="noopener noreferrer">
            <button
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                color: 'white',
                backgroundColor: '#00bfa5',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Register Now
            </button>
          </a>

        </div>
      </div>

    </div>
  );
}
