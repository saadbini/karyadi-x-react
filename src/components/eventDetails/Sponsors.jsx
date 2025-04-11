import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { sponsorAPI, partnerAPI, collaboratorAPI } from "../../utils/api";

const Sponsors = () => {
  const { id } = useParams();
  const [sponsors, setSponsors] = useState([]);
  const [partners, setPartners] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [broughtBy, setBroughtBy] = useState([]);

  useEffect(() => {
    fetchSponsors();
    fetchPartners();
    fetchCollaborators();
  }, []);

  const fetchSponsors = async () => {
    try {
      const data = await sponsorAPI.getSponsorsByEventId(id);
      // console.log(data.data)
      setSponsors(data.data);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    }
  };

  const fetchPartners = async () => {
    try {
      const data = await partnerAPI.getPartnersByEventId(id);
      setPartners(data.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const fetchCollaborators = async () => {
    try {
      const data = await collaboratorAPI.getCollaboratorsByEventId(id);
      // console.log(data.data)
      const collaborators = data.data.filter(
        (collab) => collab.event_collaborator_type === "Collaborator"
      );
      const broughtBy = data.data.filter(
        (collab) => collab.event_collaborator_type === "BroughtBy"
      );
      setCollaborators(collaborators);
      setBroughtBy(broughtBy);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "Platinum":
        return "border border-gray-400";
      case "Gold":
        return "border border-yellow-500";
      case "Silver":
        return "border border-gray-500";
      default:
        return "border border-gray-300";
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      {/* In Collaboration With */}
      {collaborators.length > 0 && (
        <>
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            In Collaboration With
          </h2>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {collaborators.map((collab) => (
              <div
                key={collab.id}
                className="w-40 p-4 flex flex-col items-center"
              >
                {collab.Organization.logo && (
                  <img
                    src={collab.Organization.logo}
                    alt={collab.Organization.name}
                    className="h-12 mb-2 object-contain"
                  />
                )}
                <p className="text-gray-700 text-center text-sm">
                  {collab.Organization.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sponsors Section */}
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        Sponsors
      </h2>
      {["Platinum", "Gold", "Silver"].map((tier) => {
        const tierSponsors = sponsors.filter(
          (sponsor) => sponsor.event_sponsor_tier === tier
        );
        return tierSponsors.length > 0 ? (
          <div key={tier} className="mb-8">
            <h3 className="text-xl font-medium text-gray-700 text-center mb-4">
              {tier} Sponsors
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {tierSponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className={`w-40 p-4 rounded-lg shadow-md flex flex-col items-center ${getTierColor(
                    tier
                  )}`}
                >
                  {sponsor.Organization.logo && (
                    <img
                      src={sponsor.Organization.logo}
                      alt={sponsor.Organization.name}
                      className="h-12 mb-2 object-contain"
                    />
                  )}
                  <p className="text-gray-700 text-center text-sm">
                    {sponsor.Organization.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      })}

      {/* Partners Section */}
      {partners.length > 0 && (
        <>
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Partners
          </h2>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="w-40 p-4 flex flex-col items-center"
              >
                {partner.Organization.logo && (
                  <img
                    src={partner.Organization.logo}
                    alt={partner.Organization.name}
                    className="h-12 mb-2 object-contain"
                  />
                )}
                <p className="text-gray-700 text-center text-sm">
                  {partner.Organization.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Brought to You By Section */}
      {broughtBy.length > 0 && (
        <>
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Brought to You By
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {broughtBy.map((company) => (
              <div
                key={company.id}
                className="w-40 p-4 flex flex-col items-center"
              >
                {company.Organization.logo && (
                  <img
                    src={company.Organization.logo}
                    alt={company.Organization.name}
                    className="h-12 mb-2 object-contain"
                  />
                )}
                <p className="text-gray-700 text-center text-sm">
                  {company.Organization.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sponsors;
