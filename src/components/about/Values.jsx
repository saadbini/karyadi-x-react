import React from 'react';

const values = [
  {
    title: 'Innovation',
    description: 'We embrace new technologies and ideas to provide the best job-seeking experience.'
  },
  {
    title: 'Integrity',
    description: 'We maintain the highest standards of honesty and transparency in all our operations.'
  },
  {
    title: 'Inclusion',
    description: 'We believe in creating equal opportunities for everyone, regardless of their background.'
  },
  {
    title: 'Impact',
    description: "We strive to make a positive difference in people's careers and lives."
  },
];

export default function Values() {
  return (
    <div className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Our Values
          </h2>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-medium text-karyadi-teal mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-500">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}