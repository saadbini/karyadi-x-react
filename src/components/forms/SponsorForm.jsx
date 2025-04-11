import React, { useState, useEffect } from "react";
import { sponsorAPI, organizationAPI } from "../../utils/api";
import dropdownOptions from "../../utils/dropdownOptions";
import { useNavigate } from "react-router-dom";

export default function SponsorForm({
  eventId,
  setStep,
  handlePrevious,
  handleFinish,
}) {
  const navigate = useNavigate();
  const [sponsors, setSponsors] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [showNewOrganizationForm, setShowNewOrganizationForm] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    organization_description: "",
    logo: "",
    no_of_employees: "",
    website_url: "",
    industry_category: "",
    user_id: null,
  });
  const [eventSponsorTier, setEventSponsorTier] = useState("");

  useEffect(() => {
    fetchOrganizations();
    fetchSponsors();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const data = await organizationAPI.getAllOrganizations();
      setOrganizations(data.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchSponsors = async () => {
    try {
      const data = await sponsorAPI.getSponsorsByEventId(eventId);
      setSponsors(data.data);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTierChange = (e) => {
    setEventSponsorTier(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOrganization && !showNewOrganizationForm) {
      alert("Please choose or create an organization");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      // console.log(user.id);
      const dataToSubmit = {
        ...formData,
        user_id: user.id || null,
        no_of_employees: formData.no_of_employees ? parseInt(formData.no_of_employees, 10) : null,

      };

      if (showNewOrganizationForm) {
        const createdOrganization = await organizationAPI.createOrganization(
          dataToSubmit,
          token
        );
        const createdSponsor = await sponsorAPI.createSponsor(
          {
            organization_id: createdOrganization.data.id,
            event_sponsor_tier: eventSponsorTier,
            event_id: eventId,
          },
          token
        );
        setSponsors([...sponsors, createdSponsor.data]);
        fetchOrganizations(); // Fetch updated list of organizations
      } else {
        const createdSponsor = await sponsorAPI.createSponsor(
          {
            organization_id: selectedOrganization,
            event_sponsor_tier: eventSponsorTier,
            event_id: eventId,
          },
          token
        );
        setSponsors([...sponsors, createdSponsor.data]);
      }

      setFormData({
        name: "",
        organization_description: "",
        logo: "",
        no_of_employees: "",
        website_url: "",
        industry_category: "",
        user_id: null,
      });
      setSelectedOrganization("");
      setEventSponsorTier("");
      setShowNewOrganizationForm(false);
      fetchSponsors(); // Fetch updated list of sponsors
    } catch (error) {
      console.error("Error creating sponsor:", error);
      alert("Failed to create sponsor");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await sponsorAPI.deleteSponsor(id, token);
      setSponsors(sponsors.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      alert("Failed to delete sponsor");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Sponsor</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="organization"
            className="block text-sm font-medium text-gray-700"
          >
            Choose Existing Organization
          </label>
          <select
            name="organization"
            id="organization"
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="event_sponsor_tier"
            className="block text-sm font-medium text-gray-700"
          >
            Sponsor Tier
          </label>
          <select
            name="event_sponsor_tier"
            id="event_sponsor_tier"
            value={eventSponsorTier}
            onChange={handleTierChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
          >
            <option value="">Select Sponsor Tier</option>
            {dropdownOptions.eventSponsorTier.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowNewOrganizationForm(!showNewOrganizationForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            {showNewOrganizationForm
              ? "Cancel Adding New Organization"
              : "Add New Organization"}
          </button>
        </div>

        {showNewOrganizationForm && (
          <>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Organization Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="organization_description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="organization_description"
                id="organization_description"
                value={formData.organization_description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="logo"
                className="block text-sm font-medium text-gray-700"
              >
                Logo URL
              </label>
              <input
                type="text"
                name="logo"
                id="logo"
                value={formData.logo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="no_of_employees"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Employees
              </label>
              <input
                type="number"
                name="no_of_employees"
                id="no_of_employees"
                value={formData.no_of_employees}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="website_url"
                className="block text-sm font-medium text-gray-700"
              >
                Website URL
              </label>
              <input
                type="text"
                name="website_url"
                id="website_url"
                value={formData.website_url}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="industry_category"
                className="block text-sm font-medium text-gray-700"
              >
                Industry Category
              </label>
              <select
                name="industry_category"
                id="industry_category"
                value={formData.industry_category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
              >
                <option value="">Select Industry Category</option>
                {dropdownOptions.industryCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50"
        >
          Add Sponsor
        </button>
      </form>

      {/* Display added sponsors */}
      {sponsors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Added Sponsors</h3>
          <ul className="space-y-4">
            {sponsors.map((item) => (
              <li
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-800 text-lg mb-4">
                      {organizations.find(
                        (org) => org.id === item.organization_id
                      )?.name || "Unknown Organization"}
                    </h4>
                    <p>
                      <span className="text-teal-600">
                        {item.event_sponsor_tier}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="ml-4 p-2 text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* line break - divider */}
      <hr className="my-6 border-gray-200" />

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setStep(6)}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Next: Add Collaborator
        </button>
        <button
          onClick={handleFinish}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
