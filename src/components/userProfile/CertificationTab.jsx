import React, { useEffect, useState } from "react";
import { certificationAPI } from "../../utils/api";
import { HiOutlinePencil, HiPlusCircle, HiXMark } from "react-icons/hi2";
import { toast } from "react-hot-toast";
import ProfileTabCard from "./ProfileTabCard";
import LoadingSpinner from "../../utils/LoadingSpinner";


function CertificationTab({ userId }) {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCert, setCurrentCert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [certNameSuggestions, setCertNameSuggestions] = useState([]);
  const [issuerSuggestions, setIssuerSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    certification_name: "",
    issuing_organization: "",
    issue_date: "",
    has_expiration_date: false,
    expiration_date: "",
    credential_id: "",
    credential_url: "",
  });
  const [formErrors, setFormErrors] = useState({
    certification_name: "",
    issuing_organization: "",
    issue_date: "",
  });
  const [editErrors, setEditErrors] = useState({
    certification_name: "",
    issuing_organization: "",
    issue_date: "",
  });
  

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setIsLoading(true);
        const result = await certificationAPI.getCertificationsByUserId(userId);
        setCertifications(result.data);
      } catch (err) {
        console.error("Error fetching certifications:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCertifications();
  }, [userId]);  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "certification_name" && value.length > 1) {
      certificationAPI.getCertNameSuggestions(value).then(res => {
        setCertNameSuggestions(res.data);
      }).catch(err => console.error("Cert name suggestion error:", err));
    }
    
    if (name === "issuing_organization" && value.length > 1) {
      certificationAPI.getIssuerSuggestions(value).then(res => {
        setIssuerSuggestions(res.data);
      }).catch(err => console.error("Issuer suggestion error:", err));
    }
    
  
    setFormData((prev) => {
      if (type === "checkbox" && name === "has_expiration_date") {
        return {
          ...prev,
          has_expiration_date: checked,
          expiration_date: checked ? prev.expiration_date : null, // 👈 set to null if unchecked
        };
      }
  
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };  

  const resetForm = () => {
    setFormData({
      certification_name: "",
      issuing_organization: "",
      issue_date: "",
      has_expiration_date: false,
      expiration_date: "",
      credential_id: "",
      credential_url: "",
    });
  };

  const handleCreate = async () => {

    const errors = {};
  if (!formData.certification_name.trim()) {
    errors.certification_name = "Certification name is required.";
  }
  if (!formData.issuing_organization.trim()) {
    errors.issuing_organization = "Issuing organization is required.";
  }
  if (!formData.issue_date) {
    errors.issue_date = "Issue date is required.";
  }

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  setFormErrors({}); // Clear previous errors

    const { certification_name, issuing_organization, issue_date } = formData;

    if (!certification_name || !issuing_organization || !issue_date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        ...formData,
        user_id: userId,
        expiration_date: formData.has_expiration_date ? formData.expiration_date : null, // 👈 key line
      };
  
      await certificationAPI.createCertification(payload);
      toast.success("Certification added successfully!");
  
      resetForm();
      setShowModal(false);
  
      const updated = await certificationAPI.getCertificationsByUserId(userId);
      setCertifications(updated.data);
    } catch (error) {
      console.error("Error creating certification:", error);
      toast.error("Failed to add certification.");
    }
  };  

  const handleDelete = async (certId) => {
    if (!window.confirm("Are you sure you want to delete this certification?")) return;
  
    try {
      await certificationAPI.deleteCertification(certId);
      toast.success("Certification deleted!");
      const updated = await certificationAPI.getCertificationsByUserId(userId);
      setCertifications(updated.data);
    } catch (error) {
      console.error("Error deleting certification:", error);
      toast.error("Failed to delete certification.");
    }
  };
  

  return (

    // CertificationTab Button Component 
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Certifications</h3>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-[#00d4c8] hover:text-[#00bfb3]"
        >
          Add Certification
        </button>
      </div>

      {/* EDIT MODAL */}

      {isEditing && currentCert && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative animate-fadeIn">
          <h3 className="text-lg font-semibold mb-4">Edit Certification</h3>

          <div className="space-y-3">
          <input
            type="text"
            name="certification_name"
            list="certification-names"
            value={currentCert.certification_name}
            onChange={(e) =>
              setCurrentCert({ ...currentCert, certification_name: e.target.value })
            }
            placeholder="Certification Name"
            className={`w-full border px-3 py-2 rounded ${editErrors.certification_name ? "border-red-500" : ""}`}
          />
          {editErrors.certification_name && (
          <p className="text-sm text-red-500 mt-1">{editErrors.certification_name}</p>
          )}
          <datalist id="certification-names">
            {certNameSuggestions.map((name, idx) => (
              <option key={idx} value={name} />
            ))}
          </datalist>

            <input
              type="text"
              name="issuing_organization"
              value={currentCert.issuing_organization}
              onChange={(e) =>
                setCurrentCert({ ...currentCert, issuing_organization: e.target.value })
              }
              placeholder="Issuing Organization"
              className={`w-full border px-3 py-2 rounded ${editErrors.issuing_organization ? "border-red-500" : ""}`}
              />
              {editErrors.issuing_organization && (
              <p className="text-sm text-red-500 mt-1">{editErrors.issuing_organization}</p>
              )}

            <input
              type="date"
              name="issue_date"
              value={currentCert.issue_date ? currentCert.issue_date.slice(0, 10) : ""}
              onChange={(e) =>
                setCurrentCert({ ...currentCert, issue_date: e.target.value })
              }
              className={`w-full border px-3 py-2 rounded ${editErrors.issue_date ? "border-red-500" : ""}`}
              />
              {editErrors.issue_date && (
              <p className="text-sm text-red-500 mt-1">{editErrors.issue_date}</p>
              )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="has_expiration_date"
                checked={currentCert.has_expiration_date}
                onChange={(e) =>
                  setCurrentCert((prev) => ({
                    ...prev,
                    has_expiration_date: e.target.checked,
                    expiration_date: e.target.checked ? prev.expiration_date : null,
                  }))
                }
              />
              <span>Has Expiration Date</span>
            </label>

            {currentCert.has_expiration_date && (
              <input
                type="date"
                name="expiration_date"
                value={currentCert.expiration_date ? currentCert.expiration_date.slice(0, 10) : ""}
                onChange={(e) =>
                  setCurrentCert({ ...currentCert, expiration_date: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
            )}

            <input
              type="text"
              name="credential_id"
              value={currentCert.credential_id}
              onChange={(e) =>
                setCurrentCert({ ...currentCert, credential_id: e.target.value })
              }
              placeholder="Credential ID"
              className="w-full border px-3 py-2 rounded"
            />

            <input
              type="text"
              name="credential_url"
              value={currentCert.credential_url}
              onChange={(e) =>
                setCurrentCert({ ...currentCert, credential_url: e.target.value })
              }
              placeholder="Credential URL"
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex justify-end pt-4 gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentCert(null);
                }}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {

                  const errors = {};
                  if (!currentCert.certification_name.trim()) {
                    errors.certification_name = "Certification name is required.";
                  }
                  if (!currentCert.issuing_organization.trim()) {
                    errors.issuing_organization = "Issuing organization is required.";
                  }
                  if (!currentCert.issue_date) {
                    errors.issue_date = "Issue date is required.";
                  }

                  if (Object.keys(errors).length > 0) {
                    setEditErrors(errors);
                    return;
                  }

                  setEditErrors({});

                  const { certification_name, issuing_organization, issue_date } = currentCert;

                  if (!certification_name || !issuing_organization || !issue_date) {
                    toast.error("Please fill in all required fields.");
                    return;
                  }
                  
                  try {
                    const payload = {
                      ...currentCert,
                      expiration_date: currentCert.has_expiration_date ? currentCert.expiration_date : null,
                    };
                    await certificationAPI.updateCertification(currentCert.id, payload);
                    toast.success("Certification updated!");
                    const refreshed = await certificationAPI.getCertificationsByUserId(userId);
                    setCertifications(refreshed.data);
                    setIsEditing(false);
                    setCurrentCert(null);
                  } catch (err) {
                    console.error(err);
                    toast.error("Update failed.");
                  }
                }}
                className="px-4 py-2 bg-[#00bfb3] text-white rounded hover:bg-[#009f94]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    )}



      {/* Certification List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size={32} />
        </div>
      ) : certifications.length === 0 ? (
        <p className="text-gray-500">No certifications added yet.</p>
      ) : (
        <ul className="space-y-3">
          {certifications.map((cert) => (
            <li key={cert.id}>
              <ProfileTabCard
                title={cert.certification_name}
                onEdit={() => {
                  setCurrentCert(cert);
                  setIsEditing(true);
                }}                
                onDelete={() => handleDelete(cert.id)}
              >
                <div className="text-sm text-gray-600">{cert.issuing_organization}</div>
                <div className="text-sm mt-1">
                  Issued: {new Date(cert.issue_date).toLocaleDateString()}
                </div>
                {cert.expiration_date && (
                  <div className="text-sm">
                    Expires: {new Date(cert.expiration_date).toLocaleDateString()}
                  </div>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#00d4c8] hover:text-[#00bfb3] block mt-2"
                  >
                    View Certificate
                  </a>
                )}
              </ProfileTabCard>
            </li>
          ))}
        </ul>
      )}



      {/*   ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-xl relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              <HiXMark size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-4">Add Certification</h3>

            <div className="space-y-3">
            <input
               type="text"
               name="certification_name"
               list="certification-names"
               value={formData.certification_name}
               onChange={handleInputChange}
               placeholder="Certification Name"
               className={`w-full border px-3 py-2 rounded ${formErrors.certification_name ? "border-red-500" : ""}`}
               required
            />
            {formErrors.certification_name && (
            <p className="text-sm text-red-500 mt-1">{formErrors.certification_name}</p>
            )}
            <datalist id="certification-names">
              {certNameSuggestions.map((name, idx) => (
                <option key={idx} value={name} />
              ))}
            </datalist>

            <input
              type="text"
              name="issuing_organization"
              list="issuing-orgs"
              value={formData.issuing_organization}
              onChange={handleInputChange}
              placeholder="Issuing Organization"
              className={`w-full border px-3 py-2 rounded ${formErrors.issuing_organization ? "border-red-500" : ""}`}
              required
            />
            {formErrors.issuing_organization && (
            <p className="text-sm text-red-500 mt-1">{formErrors.issuing_organization}</p>
            )}
            <datalist id="issuing-orgs">
              {issuerSuggestions.map((org, idx) => (
                <option key={idx} value={org} />
              ))}
            </datalist>

              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleInputChange}
                className={`w-full border px-3 py-2 rounded ${formErrors.issue_date ? "border-red-500" : ""}`}
                required
              />
              {formErrors.issue_date && (
              <p className="text-sm text-red-500 mt-1">{formErrors.issue_date}</p>
              )}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="has_expiration_date"
                  checked={formData.has_expiration_date}
                  onChange={handleInputChange}
                />
                <span>Has Expiration Date</span>
              </label>

              {formData.has_expiration_date && (
              <input
                type="date"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              )}

              <input
                type="text"
                name="credential_id"
                value={formData.credential_id}
                onChange={handleInputChange}
                placeholder="Credential ID"
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="text"
                name="credential_url"
                value={formData.credential_url}
                onChange={handleInputChange}
                placeholder="Credential URL"
                className="w-full border px-3 py-2 rounded"
              />

              <div className="flex justify-end pt-4 gap-2">
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-[#00bfb3] text-white rounded hover:bg-[#009f94]"
                >
                  Save
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificationTab;
