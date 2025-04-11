import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { attendanceAPI } from "../../utils/api";

const Attendees = () => {
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState("members");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    try {
      const data = await attendanceAPI.getAttendanceByEventId(id);
      categorizeAttendees(data.data);
      // console.log(data.data);
    } catch (error) {
      console.error("Error fetching attendees:", error);
    }
  };

  const categorizeAttendees = (attendees) => {
    const membersList = attendees.filter(
      (attendee) => attendee.User.user_type === "member"
    ).map(attendee => attendee.User);
    const companiesList = attendees.filter(
      (attendee) => attendee.User.user_type === "company"
    ).map(attendee => attendee.User);
    setMembers(membersList);
    setCompanies(companiesList);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Attendees</h2>
      <div className="flex flex-col sm:flex-row mb-4 gap-2">
        <div className="flex">
          <button
            className={`px-4 py-2 ${activeTab === "members"
              ? "bg-teal-600 text-white"
              : "bg-gray-200 text-gray-700"
              } rounded-l-md transition duration-300 ease-in-out`}
            onClick={() => setActiveTab("members")}
          >
            Members ({members.length})
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "companies"
              ? "bg-teal-600 text-white"
              : "bg-gray-200 text-gray-700"
              } rounded-r-md transition duration-300 ease-in-out`}
            onClick={() => setActiveTab("companies")}
          >
            Organizations ({companies.length})
          </button>
        </div>
        <input
          type="text"
          placeholder={`Search ${activeTab === "members" ? "Members" : "Organizations"}`}
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <div>
        {activeTab === "members" && (
          <>
            <p className="text-gray-600 mb-4">Showing {filteredMembers.length} of {members.length} members</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div
                  key={member.email}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                >
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-gray-700 text-sm truncate">{member.email}</p>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === "companies" && (
          <>
            <p className="text-gray-600 mb-4">Showing {filteredCompanies.length} of {companies.length} organizations</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <div
                  key={company.email}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                >
                  <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
                  <p className="text-gray-700 text-sm truncate">
                    {company.email}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Attendees;
