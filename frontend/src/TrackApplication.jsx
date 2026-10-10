import { useState } from "react";
import "./TrackApplication.css";

function TrackApplication({ onBack }) {
  const [applicationId, setApplicationId] = useState("");
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTrack = async (event) => {
    event.preventDefault();

    const id = applicationId.trim();

    if (!id) {
      setError("Please enter an Application ID.");
      setApplication(null);
      return;
    }

    setLoading(true);
    setError("");
    setApplication(null);
    setCopied(false);

    try {
      const response = await fetch(
        `/api/applications/${encodeURIComponent(id)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError(
            "Application not found. Please check your Application ID and try again."
          );
        } else {
          setError(
            "Could not retrieve the application. Please try again."
          );
        }

        return;
      }

      const result = await response.json();

      setApplication(result);

    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to the Java server. Make sure Spring Boot is running."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = async () => {
    if (!application?.applicationId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        application.applicationId
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error(error);
    }
  };

  const getStatusClass = () => {
    if (!application) {
      return "";
    }

    if (application.status === "Rejected") {
      return "tracking-rejected";
    }

    if (application.status === "Registered") {
      return "tracking-registered";
    }

    return "tracking-verification";
  };

  const getStatusDescription = () => {
    if (!application) {
      return "";
    }

    if (application.status === "Rejected") {
      return "Your application has been rejected. Please review the reason provided below.";
    }

    if (application.status === "Registered") {
      return "Your land registration application has been successfully registered.";
    }

    return "Your application has been received and is currently being verified by the registration officer.";
  };

  return (
    <div className="track-page">

      <div className="track-container">

        {/* BACK */}

        <button
          type="button"
          className="back-link"
          onClick={onBack}
        >
          ← Back to Home
        </button>

        {/* HEADER */}

        <div className="track-header">

          <div className="track-header-icon">
            ⌕
          </div>

          <div>
            <h1>Track Application</h1>

            <p className="track-subtitle">
              Enter your Application ID to view the latest
              status of your land registration application.
            </p>
          </div>

        </div>

        {/* SEARCH CARD */}

        <div className="track-search-card">

          <div className="search-heading">
            <div>
              <strong>Application ID</strong>

              <span>
                Enter the ID received after submitting your application.
              </span>
            </div>
          </div>

          <form
            className="track-form"
            onSubmit={handleTrack}
          >

            <div className="track-input-wrapper">

              <span className="input-search-icon">
                #
              </span>

              <input
                type="text"
                placeholder="Example: LR20260923ABC123"
                value={applicationId}
                onChange={(event) =>
                  setApplicationId(event.target.value)
                }
                disabled={loading}
                autoComplete="off"
                spellCheck="false"
              />

            </div>

            <button
              type="submit"
              className="track-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="track-spinner"></span>
                  Checking...
                </>
              ) : (
                <>
                  Track Application
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className="search-help">
            <span>i</span>
            Application IDs are case-sensitive. Enter the ID exactly as provided.
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="track-error">

            <div className="track-error-icon">
              !
            </div>

            <div>
              <strong>
                Unable to find application
              </strong>

              <p>
                {error}
              </p>
            </div>

          </div>
        )}

        {/* APPLICATION RESULT */}

        {application && (
          <div className="tracking-result">

            {/* RESULT HEADER */}

            <div className="result-header">

              <div>

                <span className="result-label">
                  APPLICATION STATUS
                </span>

                <h2>
                  {application.status}
                </h2>

                <p>
                  {getStatusDescription()}
                </p>

              </div>

              <div
                className={`result-status-icon ${getStatusClass()}`}
              >
                {application.status === "Rejected"
                  ? "!"
                  : application.status === "Registered"
                  ? "✓"
                  : "↻"}
              </div>

            </div>

            {/* STATUS TIMELINE */}

            <div className="status-timeline">

              <div
                className={`timeline-step completed`}
              >
                <div className="timeline-dot">
                  ✓
                </div>

                <div className="timeline-content">
                  <strong>Application Submitted</strong>

                  <span>
                    {application.submittedAt
                      ? new Date(
                          application.submittedAt
                        ).toLocaleString()
                      : "Submitted"}
                  </span>
                </div>
              </div>

              <div
                className={`timeline-line ${
                  application.status !== "Rejected"
                    ? "timeline-line-active"
                    : "timeline-line-rejected"
                }`}
              ></div>

              <div
                className={`timeline-step ${
                  application.status === "Under Verification" ||
                  application.status === "Registered"
                    ? "current"
                    : application.status === "Rejected"
                    ? "rejected"
                    : ""
                }`}
              >
                <div className="timeline-dot">
                  {application.status === "Rejected"
                    ? "!"
                    : application.status === "Registered"
                    ? "✓"
                    : "2"}
                </div>

                <div className="timeline-content">
                  <strong>
                    {application.status === "Rejected"
                      ? "Application Rejected"
                      : "Under Verification"}
                  </strong>

                  <span>
                    {application.status === "Rejected"
                      ? application.rejectedAt
                        ? new Date(
                            application.rejectedAt
                          ).toLocaleString()
                        : "Application rejected"
                      : application.status === "Under Verification"
                      ? "Currently being reviewed"
                      : "Verification completed"}
                  </span>
                </div>
              </div>

              {application.status !== "Rejected" && (
                <>
                  <div
                    className={`timeline-line ${
                      application.status === "Registered"
                        ? "timeline-line-active"
                        : ""
                    }`}
                  ></div>

                  <div
                    className={`timeline-step ${
                      application.status === "Registered"
                        ? "completed"
                        : ""
                    }`}
                  >
                    <div className="timeline-dot">
                      {application.status === "Registered"
                        ? "✓"
                        : "3"}
                    </div>

                    <div className="timeline-content">
                      <strong>
                        Registration Complete
                      </strong>

                      <span>
                        {application.status === "Registered"
                          ? application.registeredAt
                            ? new Date(
                                application.registeredAt
                              ).toLocaleString()
                            : "Registered"
                          : "Pending verification"}
                      </span>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* APPLICATION INFORMATION */}

            <div className="application-info-section">

              <div className="info-section-title">

                <div className="info-section-icon">
                  ✓
                </div>

                <div>
                  <h3>Application Information</h3>

                  <p>
                    Details associated with this application.
                  </p>
                </div>

              </div>

              <div className="application-info-grid">

                <div className="info-item application-id-item">

                  <span>Application ID</span>

                  <div className="id-value-wrapper">

                    <strong>
                      {application.applicationId}
                    </strong>

                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="copy-track-id"
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </button>

                  </div>

                </div>

                <div className="info-item">
                  <span>Applicant Name</span>
                  <strong>
                    {application.applicantName || "-"}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Survey Number</span>
                  <strong>
                    {application.surveyNumber || "-"}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Land Area</span>
                  <strong>
                    {application.landArea || "-"}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Land Type</span>
                  <strong>
                    {application.landType || "-"}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Village</span>
                  <strong>
                    {application.village || "-"}
                  </strong>
                </div>

                <div className="info-item">
                  <span>District</span>
                  <strong>
                    {application.district || "-"}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Payment Status</span>

                  <strong
                    className={`payment-status ${
                      application.paymentStatus === "Paid"
                        ? "payment-paid"
                        : ""
                    }`}
                  >
                    {application.paymentStatus || "-"}
                  </strong>

                </div>

              </div>

            </div>

            {/* REJECTION REASON */}

            {application.status === "Rejected" &&
              application.rejectionReason && (
                <div className="rejection-card">

                  <div className="rejection-icon">
                    !
                  </div>

                  <div>
                    <strong>
                      Reason for Rejection
                    </strong>

                    <p>
                      {application.rejectionReason}
                    </p>
                  </div>

                </div>
              )}

            {/* DATES */}

            <div className="tracking-dates">

              <div className="date-item">

                <span>
                  Submitted On
                </span>

                <strong>
                  {application.submittedAt
                    ? new Date(
                        application.submittedAt
                      ).toLocaleString()
                    : "-"}
                </strong>

              </div>

              {application.status === "Registered" &&
                application.registeredAt && (
                  <div className="date-item">

                    <span>
                      Registered On
                    </span>

                    <strong>
                      {new Date(
                        application.registeredAt
                      ).toLocaleString()}
                    </strong>

                  </div>
                )}

              {application.status === "Rejected" &&
                application.rejectedAt && (
                  <div className="date-item">

                    <span>
                      Rejected On
                    </span>

                    <strong>
                      {new Date(
                        application.rejectedAt
                      ).toLocaleString()}
                    </strong>

                  </div>
                )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default TrackApplication;