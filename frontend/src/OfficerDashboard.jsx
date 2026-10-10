import { useEffect, useMemo, useState } from "react";
import "./OfficerDashboard.css";

function OfficerDashboard({ onBack, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [registeringId, setRegisteringId] = useState(null);
  const [rejectingLoadingId, setRejectingLoadingId] = useState(null);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [showDetails, setShowDetails] = useState(false);

  // =========================================================
  // LOAD APPLICATIONS
  // =========================================================

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/officer/applications"
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data === "string"
            ? data
            : data.error ||
                "Could not load applications."
        );

        return;
      }

      setApplications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to the Java server. Make sure Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalApplications = applications.length;

  const paidApplications = useMemo(() => {
    return applications.filter(
      (application) =>
        application.paymentStatus === "Paid"
    ).length;
  }, [applications]);

  const todayApplications = useMemo(() => {
    const today = new Date();

    return applications.filter((application) => {
      if (!application.submittedAt) {
        return false;
      }

      const submittedDate = new Date(
        application.submittedAt
      );

      return (
        submittedDate.getDate() === today.getDate() &&
        submittedDate.getMonth() ===
          today.getMonth() &&
        submittedDate.getFullYear() ===
          today.getFullYear()
      );
    }).length;
  }, [applications]);

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const clearNotifications = () => {
    setMessage("");
    setError("");
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString();
  };

  // =========================================================
  // OPEN FULL APPLICATION
  // =========================================================

  const handleViewDetails = (application) => {
    clearNotifications();

    setSelectedApplication(application);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedApplication(null);
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const handleRegisterClick = (application) => {
    clearNotifications();

    setSelectedApplication(application);
    setShowRegisterModal(true);
  };

  const handleRegister = async () => {
    if (!selectedApplication) {
      return;
    }

    const applicationId =
      selectedApplication.applicationId;

    setShowRegisterModal(false);
    setShowDetails(false);

    setRegisteringId(applicationId);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/officer/applications/${encodeURIComponent(
          applicationId
        )}/register`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data === "string"
            ? data
            : data.error ||
                "Could not complete registration."
        );

        return;
      }

      setMessage(
        `Land registration completed successfully for Application ID: ${data.applicationId}`
      );

      setSelectedApplication(null);

      await loadApplications();
    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to the Java server. Make sure Spring Boot is running."
      );
    } finally {
      setRegisteringId(null);
    }
  };

  // =========================================================
  // REJECT
  // =========================================================

  const openRejectForm = (applicationId) => {
    clearNotifications();

    setRejectingId(applicationId);
    setRejectionReason("");
  };

  const cancelReject = () => {
    setRejectingId(null);
    setRejectionReason("");
  };

  const handleReject = async (applicationId) => {
    if (!rejectionReason.trim()) {
      setError(
        "Please enter a reason for rejection."
      );

      return;
    }

    setRejectingLoadingId(applicationId);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/officer/applications/${encodeURIComponent(
          applicationId
        )}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: rejectionReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data === "string"
            ? data
            : data.error ||
                "Could not reject the application."
        );

        return;
      }

      setMessage(
        `Application ${data.applicationId} has been rejected successfully.`
      );

      setRejectingId(null);
      setRejectionReason("");

      setShowDetails(false);
      setSelectedApplication(null);

      await loadApplications();
    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to the Java server. Make sure Spring Boot is running."
      );
    } finally {
      setRejectingLoadingId(null);
    }
  };

  // =========================================================
  // DOCUMENT VIEWER
  // =========================================================

  const handleDocumentClick = (
    applicationId,
    documentType
  ) => {
    clearNotifications();

    if (!applicationId || !documentType) {
      setError("Document information is missing.");
      return;
    }

    const documentUrl =
      `/api/officer/applications/${encodeURIComponent(
        applicationId
      )}/documents/${encodeURIComponent(documentType)}`;

    const documentWindow = window.open(
      documentUrl,
      "_blank",
      "noopener,noreferrer"
    );

    if (!documentWindow) {
      setError(
        "The document could not be opened. Please allow pop-ups for this site."
      );
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="officer-page">
      <div className="officer-container">

        {/* =================================================
            NAVBAR
        ================================================= */}

        <header className="officer-navbar">

          <div className="officer-brand">

            <div className="officer-brand-icon">
              LR
            </div>

            <div>
              <strong>
                Land Registration
              </strong>

              <span>
                Officer Portal
              </span>
            </div>

          </div>

          <div className="officer-nav-actions">

            <button
              type="button"
              className="officer-home-btn"
              onClick={onBack}
            >
              ← Home
            </button>

            <button
              type="button"
              className="officer-logout-btn"
              onClick={onLogout}
            >
              <span>↪</span>
              Logout
            </button>

          </div>

        </header>

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="officer-page-header">

          <div>

            <div className="officer-page-label">
              OFFICER CONTROL PANEL
            </div>

            <h1>
              Officer Dashboard
            </h1>

            <p>
              Review, verify and process submitted land
              registration applications.
            </p>

          </div>

          <button
            type="button"
            className="refresh-btn"
            onClick={loadApplications}
            disabled={loading}
          >
            <span
              className={
                loading
                  ? "refresh-icon refresh-spinning"
                  : "refresh-icon"
              }
            >
              ↻
            </span>

            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </section>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        {message && (
          <div className="officer-alert officer-success-alert">

            <div className="alert-icon">
              ✓
            </div>

            <div>
              <strong>
                Action completed
              </strong>

              <p>
                {message}
              </p>
            </div>

            <button
              type="button"
              className="alert-close"
              onClick={() => setMessage("")}
            >
              ×
            </button>

          </div>
        )}

        {error && (
          <div className="officer-alert officer-error-alert">

            <div className="alert-icon">
              !
            </div>

            <div>
              <strong>
                Something went wrong
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button
              type="button"
              className="alert-close"
              onClick={() => setError("")}
            >
              ×
            </button>

          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="officer-stats">

          <div className="officer-stat-card">

            <div className="stat-icon stat-blue">
              #
            </div>

            <div className="stat-content">

              <span>
                Pending Applications
              </span>

              <strong>
                {totalApplications}
              </strong>

              <small>
                Awaiting verification
              </small>

            </div>

          </div>

          <div className="officer-stat-card">

            <div className="stat-icon stat-green">
              ₹
            </div>

            <div className="stat-content">

              <span>
                Paid Applications
              </span>

              <strong>
                {paidApplications}
              </strong>

              <small>
                Payment completed
              </small>

            </div>

          </div>

          <div className="officer-stat-card">

            <div className="stat-icon stat-orange">
              ◷
            </div>

            <div className="stat-content">

              <span>
                Today's Submissions
              </span>

              <strong>
                {todayApplications}
              </strong>

              <small>
                Submitted today
              </small>

            </div>

          </div>

          <div className="officer-stat-card">

            <div className="stat-icon stat-purple">
              ✓
            </div>

            <div className="stat-content">

              <span>
                Portal Status
              </span>

              <strong className="portal-online">
                Online
              </strong>

              <small>
                System operational
              </small>

            </div>

          </div>

        </section>

        {/* =================================================
            APPLICATIONS
        ================================================= */}

        <section className="applications-section">

          <div className="applications-section-header">

            <div>

              <h2>
                Applications Awaiting Verification
              </h2>

              <p>
                Review applicant information and take
                appropriate action.
              </p>

            </div>

            <div className="application-count">
              {totalApplications}{" "}
              {totalApplications === 1
                ? "Application"
                : "Applications"}
            </div>

          </div>

          {loading ? (
            <div className="officer-state-card">

              <div className="large-loader"></div>

              <h3>
                Loading applications
              </h3>

              <p>
                Please wait while the latest applications
                are retrieved.
              </p>

            </div>
          ) : applications.length === 0 ? (
            <div className="officer-state-card empty-state">

              <div className="empty-state-icon">
                ✓
              </div>

              <h3>
                All caught up
              </h3>

              <p>
                There are currently no applications waiting
                for verification.
              </p>

              <button
                type="button"
                className="empty-refresh-btn"
                onClick={loadApplications}
              >
                Refresh Applications
              </button>

            </div>
          ) : (
            <div className="officer-list">

              {applications.map((application) => {

                const isRegistering =
                  registeringId ===
                  application.applicationId;

                const isRejecting =
                  rejectingLoadingId ===
                  application.applicationId;

                return (
                  <article
                    className="officer-card"
                    key={application.applicationId}
                  >

                    {/* CARD HEADER */}

                    <div className="officer-card-header">

                      <div className="application-title">

                        <div className="application-avatar">
                          {application.applicantName
                            ? application.applicantName
                                .charAt(0)
                                .toUpperCase()
                            : "A"}
                        </div>

                        <div>

                          <h2>
                            {application.applicantName ||
                              "Applicant"}
                          </h2>

                          <div className="application-id">
                            Application ID:

                            <strong>
                              {application.applicationId}
                            </strong>
                          </div>

                        </div>

                      </div>

                      <span className="paid-badge">

                        <span>
                          ✓
                        </span>

                        {application.paymentStatus ||
                          "Paid"}

                      </span>

                    </div>

                    {/* DETAILS */}

                    <div className="officer-details">

                      <div className="detail-item">
                        <span>
                          Survey Number
                        </span>

                        <strong>
                          {application.surveyNumber ||
                            "-"}
                        </strong>
                      </div>

                      <div className="detail-item">
                        <span>
                          Land Area
                        </span>

                        <strong>
                          {application.landArea ||
                            "-"}
                        </strong>
                      </div>

                      <div className="detail-item">
                        <span>
                          Land Type
                        </span>

                        <strong>
                          {application.landType ||
                            "-"}
                        </strong>
                      </div>

                      <div className="detail-item">
                        <span>
                          Location
                        </span>

                        <strong>
                          {application.village || "-"}
                          {application.district
                            ? `, ${application.district}`
                            : ""}
                        </strong>
                      </div>

                      <div className="detail-item">
                        <span>
                          Applicant Mobile
                        </span>

                        <strong>
                          {application.mobile ||
                            "-"}
                        </strong>
                      </div>

                      <div className="detail-item">
                        <span>
                          Submitted
                        </span>

                        <strong>
                          {formatDate(
                            application.submittedAt
                          )}
                        </strong>
                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="officer-actions">

                      <button
                        type="button"
                        className="view-details-btn"
                        onClick={() =>
                          handleViewDetails(
                            application
                          )
                        }
                        disabled={
                          isRegistering ||
                          isRejecting
                        }
                      >
                        <span>
                          ◉
                        </span>

                        View Full Application
                      </button>

                      <button
                        type="button"
                        className="register-btn"
                        onClick={() =>
                          handleRegisterClick(
                            application
                          )
                        }
                        disabled={
                          isRegistering ||
                          isRejecting
                        }
                      >
                        {isRegistering ? (
                          <>
                            <span className="button-spinner"></span>
                            Registering...
                          </>
                        ) : (
                          <>
                            <span>
                              ✓
                            </span>

                            Approve & Register
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="reject-btn"
                        onClick={() =>
                          openRejectForm(
                            application.applicationId
                          )
                        }
                        disabled={
                          isRegistering ||
                          isRejecting
                        }
                      >
                        {isRejecting ? (
                          <>
                            <span className="button-spinner reject-spinner"></span>
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <span>
                              ×
                            </span>

                            Reject
                          </>
                        )}
                      </button>

                    </div>

                    {/* REJECTION FORM */}

                    {rejectingId ===
                      application.applicationId && (
                      <div className="reject-box">

                        <div className="reject-box-header">

                          <div className="reject-box-icon">
                            !
                          </div>

                          <div>

                            <h3>
                              Reject Application
                            </h3>

                            <p>
                              Please provide a clear reason
                              for rejecting this application.
                            </p>

                          </div>

                        </div>

                        <textarea
                          value={rejectionReason}
                          onChange={(event) =>
                            setRejectionReason(
                              event.target.value
                            )
                          }
                          placeholder="Enter rejection reason..."
                          rows="4"
                          maxLength="500"
                          disabled={isRejecting}
                        />

                        <div className="reject-footer">

                          <span>
                            {rejectionReason.length}/500
                          </span>

                          <div className="reject-actions">

                            <button
                              type="button"
                              className="confirm-reject-btn"
                              onClick={() =>
                                handleReject(
                                  application.applicationId
                                )
                              }
                              disabled={isRejecting}
                            >
                              {isRejecting ? (
                                <>
                                  <span className="button-spinner reject-spinner"></span>
                                  Processing...
                                </>
                              ) : (
                                "Confirm Rejection"
                              )}
                            </button>

                            <button
                              type="button"
                              className="cancel-reject-btn"
                              onClick={cancelReject}
                              disabled={isRejecting}
                            >
                              Cancel
                            </button>

                          </div>

                        </div>

                      </div>
                    )}

                  </article>
                );
              })}

            </div>
          )}

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="officer-footer">

          <div>

            <strong>
              Land Registration Portal
            </strong>

            <span>
              Officer Administration Panel
            </span>

          </div>

          <span>
            Authorized access only
          </span>

        </footer>

      </div>

      {/* =================================================
          FULL APPLICATION MODAL
      ================================================= */}

      {showDetails &&
        selectedApplication && (
          <div
            className="officer-details-overlay"
            onClick={closeDetails}
          >

            <div
              className="officer-details-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="details-modal-header">

                <div>

                  <span className="details-modal-label">
                    APPLICATION REVIEW
                  </span>

                  <h2>
                    {selectedApplication.applicantName ||
                      "Applicant"}
                  </h2>

                  <p>
                    Application ID:{" "}
                    <strong>
                      {selectedApplication.applicationId}
                    </strong>
                  </p>

                </div>

                <button
                  type="button"
                  className="details-close-btn"
                  onClick={closeDetails}
                >
                  ×
                </button>

              </div>

              <div className="details-status-row">

                <span className="details-status-badge">
                  {selectedApplication.status ||
                    "Under Verification"}
                </span>

                <span className="details-payment-badge">
                  ✓{" "}
                  {selectedApplication.paymentStatus ||
                    "Paid"}
                </span>

              </div>

              <div className="details-modal-body">

                {/* APPLICANT */}

                <section className="details-section">

                  <div className="details-section-heading">

                    <div className="details-section-number">
                      01
                    </div>

                    <div>

                      <h3>
                        Applicant Details
                      </h3>

                      <p>
                        Applicant and contact information
                      </p>

                    </div>

                  </div>

                  <div className="details-grid">

                    <div className="details-field">
                      <span>
                        Applicant Name
                      </span>

                      <strong>
                        {selectedApplication.applicantName ||
                          "-"}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        Mobile Number
                      </span>

                      <strong>
                        {selectedApplication.mobile ||
                          "-"}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        Email Address
                      </span>

                      <strong>
                        {selectedApplication.email ||
                          "-"}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        Government ID
                      </span>

                      <strong>
                        {selectedApplication.governmentId ||
                          "-"}
                      </strong>
                    </div>

                  </div>

                </section>

                {/* LAND */}

                <section className="details-section">

                  <div className="details-section-heading">

                    <div className="details-section-number">
                      02
                    </div>

                    <div>

                      <h3>
                        Land Details
                      </h3>

                      <p>
                        Property location and classification
                      </p>

                    </div>

                  </div>

                  <div className="details-grid">

                    <div className="details-field">
                      <span>
                        Survey Number
                      </span>

                      <strong>
                        {selectedApplication.surveyNumber ||
                          "-"}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        Land Area
                      </span>

                      <strong>
                        {selectedApplication.landArea ||
                          "-"}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        Land Type
                      </span>

                      <strong>
                        {selectedApplication.landType ||
                          "-"}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        Village
                      </span>

                      <strong>
                        {selectedApplication.village ||
                          "-"}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        Mandal / Taluk
                      </span>

                      <strong>
                        {selectedApplication.mandal ||
                          "-"}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        District
                      </span>

                      <strong>
                        {selectedApplication.district ||
                          "-"}
                      </strong>
                    </div>

                  </div>

                </section>

                {/* OWNER */}

                <section className="details-section">

                  <div className="details-section-heading">

                    <div className="details-section-number">
                      03
                    </div>

                    <div>

                      <h3>
                        Current Owner / Seller
                      </h3>

                      <p>
                        Existing ownership information
                      </p>

                    </div>

                  </div>

                  <div className="details-grid">

                    <div className="details-field">
                      <span>
                        Current Owner Name
                      </span>

                      <strong>
                        {selectedApplication.ownerName ||
                          "-"}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        Owner ID Number
                      </span>

                      <strong>
                        {selectedApplication.ownerId ||
                          "-"}
                      </strong>
                    </div>

                  </div>

                </section>

                {/* PAYMENT */}

                <section className="details-section">

                  <div className="details-section-heading">

                    <div className="details-section-number">
                      04
                    </div>

                    <div>

                      <h3>
                        Payment & Submission
                      </h3>

                      <p>
                        Application transaction information
                      </p>

                    </div>

                  </div>

                  <div className="details-grid">

                    <div className="details-field">
                      <span>
                        Payment Status
                      </span>

                      <strong className="field-paid">
                        {selectedApplication.paymentStatus ||
                          "-"}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        Payment Reference
                      </span>

                      <strong>
                        {selectedApplication.paymentReference ||
                          "-"}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        Submitted On
                      </span>

                      <strong>
                        {formatDate(
                          selectedApplication.submittedAt
                        )}
                      </strong>
                    </div>

                    <div className="details-field">
                      <span>
                        Current Status
                      </span>

                      <strong>
                        {selectedApplication.status ||
                          "-"}
                      </strong>
                    </div>

                  </div>

                </section>

                {/* DOCUMENTS */}

                <section className="details-section">

                  <div className="details-section-heading">

                    <div className="details-section-number">
                      05
                    </div>

                    <div>

                      <h3>
                        Submitted Documents
                      </h3>

                      <p>
                        Documents submitted with the application
                      </p>

                    </div>

                  </div>

                  <div className="documents-review-grid">

                    {/* SALE DEED */}

                    <div className="review-document-card">

                      <div className="review-document-icon">
                        PDF
                      </div>

                      <div className="review-document-info">

                        <strong>
                          Sale Deed / Ownership Document
                        </strong>

                        <span>
                          Required document
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDocumentClick(
                            selectedApplication.applicationId,
                            "sale_deed"
                          )
                        }
                      >
                        View
                      </button>

                    </div>

                    {/* IDENTITY PROOF */}

                    <div className="review-document-card">

                      <div className="review-document-icon">
                        ID
                      </div>

                      <div className="review-document-info">

                        <strong>
                          Identity Proof
                        </strong>

                        <span>
                          Required document
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDocumentClick(
                            selectedApplication.applicationId,
                            "identity_proof"
                          )
                        }
                      >
                        View
                      </button>

                    </div>

                    {/* ADDITIONAL DOCUMENT */}

                    <div className="review-document-card">

                      <div className="review-document-icon optional">
                        +
                      </div>

                      <div className="review-document-info">

                        <strong>
                          Additional Document
                        </strong>

                        <span>
                          Optional supporting document
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDocumentClick(
                            selectedApplication.applicationId,
                            "additional_document"
                          )
                        }
                      >
                        View
                      </button>

                    </div>

                  </div>

                </section>

              </div>

              {/* MODAL ACTIONS */}

              <div className="details-modal-actions">

                <button
                  type="button"
                  className="details-reject-btn"
                  onClick={() => {
                    const applicationId =
                      selectedApplication.applicationId;

                    closeDetails();

                    openRejectForm(applicationId);
                  }}
                >
                  × Reject Application
                </button>

                <button
                  type="button"
                  className="details-register-btn"
                  onClick={() =>
                    handleRegisterClick(
                      selectedApplication
                    )
                  }
                >
                  ✓ Approve & Register
                </button>

              </div>

            </div>

          </div>
        )}

      {/* =================================================
          REGISTER CONFIRMATION MODAL
      ================================================= */}

      {showRegisterModal &&
        selectedApplication && (
          <div
            className="officer-modal-overlay"
            onClick={() =>
              setShowRegisterModal(false)
            }
          >

            <div
              className="officer-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="modal-icon">
                ✓
              </div>

              <h2>
                Confirm Registration
              </h2>

              <p>
                Are you sure you want to approve and
                register this land application?
              </p>

              <div className="modal-application">

                <span>
                  Application ID
                </span>

                <strong>
                  {selectedApplication.applicationId}
                </strong>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-confirm-btn"
                  onClick={handleRegister}
                >
                  Yes, Approve & Register
                </button>

                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => {
                    setShowRegisterModal(false);
                    setSelectedApplication(null);
                  }}
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}

export default OfficerDashboard;