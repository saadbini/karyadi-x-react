import React, { useState } from 'react';

function ExperienceTab() {
  const [showForm, setShowForm] = useState(false);
  const [experience, setExperience] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    tasks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExperience({ ...experience, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Experience</h3>
        <button 
          className="text-sm text-[#00d4c8] hover:text-[#00bfb3]"
          onClick={() => setShowForm(true)}
        >
          Add Experience
        </button>
      </div>
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">123 company</h4>
              <p className="text-sm text-gray-600">Role (Full time)</p>
              <p className="text-sm text-gray-500">1 Jan 1900 - 31 Dec 2024</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Edit</span>
              ✏️
            </button>
          </div>
          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Tasks & Responsibilities</h5>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Do coding</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">Dynamik Technologies</h4>
              <p className="text-sm text-gray-600">Tester (Contract)</p>
              <p className="text-sm text-gray-500">27 Dec 2024 - present</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Edit</span>
              ✏️
            </button>
          </div>
          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Tasks & Responsibilities</h5>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Testing</li>
            </ul>
          </div>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h3 className="text-lg font-medium mb-4">Add Experience</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Company</label>
                <input 
                  type="text" 
                  name="company" 
                  value={experience.company} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <input 
                  type="text" 
                  name="role" 
                  value={experience.role} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={experience.startDate} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={experience.endDate} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tasks & Responsibilities</label>
                <textarea 
                  name="tasks" 
                  value={experience.tasks} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="mr-2 px-4 py-2 bg-gray-200 rounded-md"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#00d4c8] text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExperienceTab;