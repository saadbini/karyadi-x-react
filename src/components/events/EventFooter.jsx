import React from 'react';
import cmmi from "../../assets/CMMI_Logo.png";
import karyadi from "../../assets/Karyadi_white.png";

function Footer() {
  const cards = [
    {
      title: "Connect",
      description: "Join the conversation and be part of the community"
    },
    {
      title: "Follow",
      description: "Stay updated with out latest news and updates"
    },
    {
      title: "Read",
      description: "Catch up on insights, stories and announcement"
    },
    {
      title: "Explore",
      description: "Join the conversation and be part of the community"
    },
    {
      title: "Join",
      description: "Stay updated with out latest news and updates"
    },
    {
      title: "Share",
      description: "Catch up on insights, stories and announcement"
    }
  ];

  return (
    <footer className="bg-black text-white pb-14">
      <div className="max-w-[90%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div>
             <img src={karyadi} alt="karyadi Logo" />
            {/* <p className="text-lg mb-12 max-w-2xl">
              KARYADI is a dynamic platform designed to spur a more active participation in the evolving digital
              economy through low code solutions, data analytics, and sustainability technologies. Focusing on
              training, digital transformation consulting, and agile outsourcing, KARYADI equips businesses, the
              gig economy, and digital talents to meet current demands and adapt swiftly to future challenges.
            </p> */}

            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <p className="text-lg mb-8">
                Need help? Our team is here for you! Whether you have questions, need support, or want to explore
                collaboration opportunities, we're just a message away. Reach out anytime for prompt, personalized
                assistance – we're dedicated to making your experience seamless and productive!
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-lg mb-2">+673 238 2238</p>
                  <p className="text-lg">support@karyadi.com</p>
                </div>
                <div>
                  <p className="text-lg mb-2">Level 7, Design & Technology Building, Anggerek Desa Tech Park, Spg. 32-37, Kg. Anggerek Desa, Berakas</p>
                  <p className="text-lg">BB3713 Negara Brunei Darussalam</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-5xl font-bold mb-8">Stay in touch</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="p-6 rounded-3xl relative cursor-pointer bg-white text-black group hover:bg-[#d44e28] hover:text-white transition-colors duration-300"
                >
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-white">{card.title}</h3>
                  <p className="text-gray-600 text-sm group-hover:text-white">{card.description}</p>
                  <div className="absolute bottom-4 right-4 group-hover:text-white">
                    <svg
                      className="w-6 h-6 transform rotate-45 transition-transform duration-300 text-[#d44e28] group-hover:text-white"
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">© 2024 Dynamik Technologies Sdn Bhd.</p>
          <img src={cmmi} alt="CMMI Logo" />
        </div>
      </div>
    </footer>


  );
}

export default Footer;