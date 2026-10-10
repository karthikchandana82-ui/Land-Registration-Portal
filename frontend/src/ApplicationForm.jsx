import { useState } from "react";
import "./ApplicationForm.css";

function ApplicationForm({ onProceedToPayment, onBack }) {
  const [formData, setFormData] = useState({
    applicantName: "",
    mobile: "",
    email: "",
    governmentId: "",
    surveyNumber: "",
    landArea: "",
    village: "",
    mandal: "",
    district: "",
    landType: "",
    ownerName: "",
    ownerId: "",
    saleDeed: null,
    identityProof: null,
    additionalDocument: null,
  });

  const [declaration, setDeclaration] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: files?.[0] || null,
    }));

    setError("");
  };

  const getFileName = (file) => {
    return file ? file.name : "No file selected";
  };

  const validateForm = () => {
    if (!formData.applicantName.trim()) {
      return "Please enter the applicant name.";
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      return "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.email.trim()) {
      return "Please enter the email address.";
    }

    if (!formData.governmentId.trim()) {
      return "Please enter the government ID.";
    }

    if (!formData.surveyNumber.trim()) {
      return "Please enter the survey number.";
    }

    if (!formData.landArea.trim()) {
      return "Please enter the land area.";
    }

    if (!formData.village.trim()) {
      return "Please enter the village.";
    }

    if (!formData.mandal.trim()) {
      return "Please enter the mandal / taluk.";
    }

    if (!formData.district.trim()) {
      return "Please enter the district.";
    }

    if (!formData.landType) {
      return "Please select the land type.";
    }

    if (!formData.ownerName.trim()) {
      return "Please enter the current owner / seller name.";
    }

    if (!formData.ownerId.trim()) {
      return "Please enter the owner ID.";
    }

    if (!formData.saleDeed) {
      return "Please upload the sale deed / ownership document.";
    }

    if (!formData.identityProof) {
      return "Please upload the identity proof.";
    }

    if (!declaration) {
      return "Please accept the declaration before proceeding.";
    }

    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    onProceedToPayment(formData);
  };

  return (
    <div className="lr-application-page">

      {/* HEADER */}

      <header className="lr-app-header">
        <div className="lr-app-header-inner">

          <button
            type="button"
            className="lr-brand"
            onClick={onBack}
          >
            <span className="lr-brand-icon">LR</span>

            <span className="lr-brand-text">
              <strong>Land Registration</strong>
              <small>Government Services Portal</small>
            </span>
          </button>

          <div className="lr-secure-badge">
            <span></span>
            Secure Application
          </div>

        </div>
      </header>

      {/* MAIN */}

      <main className="lr-main">

        <div className="lr-container">

          <button
            type="button"
            className="lr-back-button"
            onClick={onBack}
          >
            ← Back to Home
          </button>

          {/* TITLE */}

          <div className="lr-page-heading">

            <div className="lr-heading-icon">
              LR
            </div>

            <div>
              <div className="lr-heading-label">
                NEW APPLICATION
              </div>

              <h1>Land Registration Application</h1>

              <p>
                Provide accurate information and upload the
                required supporting documents.
              </p>
            </div>

          </div>

          {/* PROGRESS */}

          <div className="lr-progress">

            <div className="lr-progress-item active">
              <span>01</span>
              <strong>Application Details</strong>
            </div>

            <div className="lr-progress-line"></div>

            <div className="lr-progress-item">
              <span>02</span>
              <strong>Documents</strong>
            </div>

            <div className="lr-progress-line"></div>

            <div className="lr-progress-item">
              <span>03</span>
              <strong>Payment & Submit</strong>
            </div>

          </div>

          {/* INFO */}

          <div className="lr-info-box">

            <div className="lr-info-icon">i</div>

            <div>
              <strong>Before you begin</strong>

              <p>
                Keep your ownership document and
                government-issued identity proof ready.
                Enter all information exactly as shown
                on your official documents.
              </p>
            </div>

          </div>

          <form
            className="lr-form"
            onSubmit={handleSubmit}
          >

            {/* APPLICANT */}

            <section className="lr-section">

              <div className="lr-section-heading">

                <span className="lr-section-number">
                  01
                </span>

                <div>
                  <h2>Applicant Details</h2>
                  <p>
                    Enter the details of the person
                    applying for registration.
                  </p>
                </div>

              </div>

              <div className="lr-fields">

                <div className="lr-field full">
                  <label>
                    Applicant Name <b>*</b>
                  </label>

                  <input
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="lr-field">
                  <label>
                    Mobile Number <b>*</b>
                  </label>

                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength="10"
                    inputMode="numeric"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="lr-field">
                  <label>
                    Email Address <b>*</b>
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="lr-field full">
                  <label>
                    Government ID <b>*</b>
                  </label>

                  <input
                    name="governmentId"
                    value={formData.governmentId}
                    onChange={handleChange}
                    placeholder="Enter government ID number"
                  />
                </div>

              </div>

            </section>

            {/* LAND */}

            <section className="lr-section">

              <div className="lr-section-heading">

                <span className="lr-section-number">
                  02
                </span>

                <div>
                  <h2>Land Details</h2>
                  <p>
                    Provide the location and classification
                    of the property.
                  </p>
                </div>

              </div>

              <div className="lr-fields">

                <div className="lr-field">
                  <label>
                    Survey Number <b>*</b>
                  </label>

                  <input
                    name="surveyNumber"
                    value={formData.surveyNumber}
                    onChange={handleChange}
                    placeholder="Enter survey number"
                  />
                </div>

                <div className="lr-field">
                  <label>
                    Land Area <b>*</b>
                  </label>

                  <input
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    placeholder="Example: 2.5 acres"
                  />
                </div>

                <div className="lr-field">
                  <label>
                    Village <b>*</b>
                  </label>

                  <input
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="Enter village"
                  />
                </div>

                <div className="lr-field">
                  <label>
                    Mandal / Taluk <b>*</b>
                  </label>

                  <input
                    name="mandal"
                    value={formData.mandal}
                    onChange={handleChange}
                    placeholder="Enter mandal / taluk"
                  />
                </div>

                <div className="lr-field">
                  <label>
                    District <b>*</b>
                  </label>

                  <input
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Enter district"
                  />
                </div>

                <div className="lr-field">
                  <label>
                    Land Type <b>*</b>
                  </label>

                  <select
                    name="landType"
                    value={formData.landType}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select land type
                    </option>

                    <option value="Agricultural">
                      Agricultural
                    </option>

                    <option value="Residential">
                      Residential
                    </option>

                    <option value="Commercial">
                      Commercial
                    </option>

                    <option value="Industrial">
                      Industrial
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

              </div>

            </section>

            {/* OWNER */}

            <section className="lr-section">

              <div className="lr-section-heading">

                <span className="lr-section-number">
                  03
                </span>

                <div>
                  <h2>Current Owner / Seller</h2>
                  <p>
                    Enter the existing owner's information.
                  </p>
                </div>

              </div>

              <div className="lr-fields">

                <div className="lr-field">
                  <label>
                    Current Owner Name <b>*</b>
                  </label>

                  <input
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Enter current owner name"
                  />
                </div>

                <div className="lr-field">
                  <label>
                    Owner ID Number <b>*</b>
                  </label>

                  <input
                    name="ownerId"
                    value={formData.ownerId}
                    onChange={handleChange}
                    placeholder="Enter owner ID number"
                  />
                </div>

              </div>

            </section>

            {/* DOCUMENTS */}

            <section className="lr-section lr-documents-section">

              <div className="lr-section-heading">

                <span className="lr-section-number">
                  04
                </span>

                <div>
                  <h2>Upload Documents</h2>

                  <p>
                    Upload clear copies of the required
                    supporting documents.
                  </p>
                </div>

              </div>

              <div className="lr-document-list">

                {/* SALE DEED */}

                <div className="lr-document-card">

                  <div className="lr-document-symbol">
                    PDF
                  </div>

                  <div className="lr-document-main">

                    <div className="lr-document-title">
                      Sale Deed / Ownership Document
                      <span>*</span>
                    </div>

                    <div className="lr-document-description">
                      Upload your sale deed or valid
                      ownership document.
                    </div>

                    <div className="lr-file-row">

                      <label className="lr-file-button">
                        Choose file

                        <input
                          type="file"
                          name="saleDeed"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>

                      <div className="lr-file-name">
                        {getFileName(formData.saleDeed)}
                      </div>

                    </div>

                    <div className="lr-file-help">
                      PDF, JPG, JPEG or PNG
                    </div>

                  </div>

                </div>

                {/* IDENTITY */}

                <div className="lr-document-card">

                  <div className="lr-document-symbol id">
                    ID
                  </div>

                  <div className="lr-document-main">

                    <div className="lr-document-title">
                      Identity Proof
                      <span>*</span>
                    </div>

                    <div className="lr-document-description">
                      Upload a valid government-issued
                      identity document.
                    </div>

                    <div className="lr-file-row">

                      <label className="lr-file-button">
                        Choose file

                        <input
                          type="file"
                          name="identityProof"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>

                      <div className="lr-file-name">
                        {getFileName(formData.identityProof)}
                      </div>

                    </div>

                    <div className="lr-file-help">
                      PDF, JPG, JPEG or PNG
                    </div>

                  </div>

                </div>

                {/* ADDITIONAL */}

                <div className="lr-document-card">

                  <div className="lr-document-symbol optional">
                    +
                  </div>

                  <div className="lr-document-main">

                    <div className="lr-document-title">
                      Additional Document

                      <span className="lr-optional">
                        Optional
                      </span>
                    </div>

                    <div className="lr-document-description">
                      Upload any additional supporting
                      document if required.
                    </div>

                    <div className="lr-file-row">

                      <label className="lr-file-button">
                        Choose file

                        <input
                          type="file"
                          name="additionalDocument"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>

                      <div className="lr-file-name">
                        {getFileName(
                          formData.additionalDocument
                        )}
                      </div>

                    </div>

                    <div className="lr-file-help">
                      PDF, JPG, JPEG or PNG
                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* DECLARATION */}

            <section className="lr-declaration">

              <label className="lr-check-row">

                <input
                  type="checkbox"
                  checked={declaration}
                  onChange={(event) =>
                    setDeclaration(event.target.checked)
                  }
                />

                <span className="lr-check-box"></span>

                <span className="lr-declaration-text">

                  <strong>Declaration</strong>

                  <span>
                    I declare that the information provided
                    in this application is true and correct
                    to the best of my knowledge. I understand
                    that providing false information or
                    documents may result in rejection of the
                    application.
                  </span>

                </span>

              </label>

            </section>

            {/* ERROR */}

            {error && (
              <div className="lr-error">

                <div className="lr-error-icon">
                  !
                </div>

                <div>
                  <strong>
                    Please check your application
                  </strong>

                  <p>{error}</p>
                </div>

              </div>
            )}

            {/* SUBMIT */}

            <div className="lr-submit-area">

              <div className="lr-security">

                <span>✓</span>

                <div>
                  <strong>Secure submission</strong>

                  <small>
                    Your documents are transmitted securely.
                  </small>
                </div>

              </div>

              <button
                type="submit"
                className="lr-submit-button"
              >
                Proceed to Payment
                <span>→</span>
              </button>

            </div>

          </form>

        </div>

      </main>

      <footer className="lr-footer">
        <span>Land Registration Portal</span>
        <span>Secure • Transparent • Digital</span>
      </footer>

    </div>
  );
}

export default ApplicationForm;