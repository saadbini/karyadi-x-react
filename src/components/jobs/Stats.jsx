import React from 'react';

function Stats() {
  const stats = [
    {
      value: "89%",
      label: "Job placement success rate",
      description: "Of our candidates find their ideal position"
    },
    {
      value: "2k+",
      label: "Active job listings",
      description: "New opportunities added daily"
    },
    {
      value: "50+",
      label: "Partner companies",
      description: "Leading employers in the industry"
    }
  ];

  return (
    <div className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="group bg-gradient-to-br from-[#ff4d1c] to-[#ff6b47] rounded-2xl p-8 text-white transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
          >
            <div className="text-5xl sm:text-6xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
              {stat.value}
            </div>
            <div className="text-xl font-semibold mb-2">
              {stat.label}
            </div>
            <div className="text-sm text-white/80">
              {stat.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;