import React, { useState } from 'react';

export default function Mission() {
  const [responses, setResponses] = useState({});

  const surveyQuestions = [
    {
      type: "short-answer",
      question: "How satisfied are you with our platform?",
      id: "q1",
    },
    {
      type: "long-answer",
      question: "Please share any additional feedback or suggestions.",
      id: "q2",
    },
    {
      type: "mcq-single",
      question: "What feature do you use the most?",
      id: "q3",
      options: ["Job Listings", "Event Registration", "Freelance Gigs", "Networking"],
    },
    {
      type: "mcq-multiple",
      question: "Which features should we improve? (Select all that apply)",
      id: "q4",
      options: ["UI Design", "Speed", "Job Recommendations", "Notifications"],
    },
  ];

  const handleResponseChange = (id, value) => {
    setResponses((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleMultipleChoiceChange = (id, option) => {
    setResponses((prev) => {
      const currentSelections = prev[id] || [];
      return {
        ...prev,
        [id]: currentSelections.includes(option)
          ? currentSelections.filter((item) => item !== option)
          : [...currentSelections, option]
      };
    });
  };

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            KARYADI Surveys
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Help us improve by answering a few questions.
          </p>

          <div className="mt-8 max-w-3xl mx-auto space-y-6">
            {surveyQuestions.map((question) => (
              <div key={question.id} className="border p-4 rounded-lg shadow-sm">
                <p className="text-lg text-gray-800">{question.question}</p>

                {question.type === "short-answer" && (
                  <input
                    type="text"
                    className="mt-2 w-full p-2 border rounded-md"
                    placeholder="Type your answer..."
                    value={responses[question.id] || ""}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  />
                )}

                {question.type === "long-answer" && (
                  <textarea
                    className="mt-2 w-full p-2 border rounded-md h-32"
                    placeholder="Type your detailed response..."
                    value={responses[question.id] || ""}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  />
                )}

                {question.type === "mcq-single" && (
                  <div className="mt-2">
                    {question.options.map((option, index) => (
                      <label key={index} className="block text-gray-700">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={responses[question.id] === option}
                          onChange={() => handleResponseChange(question.id, option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "mcq-multiple" && (
                  <div className="mt-2">
                    {question.options.map((option, index) => (
                      <label key={index} className="block text-gray-700">
                        <input
                          type="checkbox"
                          value={option}
                          checked={responses[question.id]?.includes(option)}
                          onChange={() => handleMultipleChoiceChange(question.id, option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => console.log("Survey responses:", responses)}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

