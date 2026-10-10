import { useState } from "react";

import "./App.css";

import ApplicationForm from "./ApplicationForm";
import PaymentPage from "./PaymentPage";
import TrackApplication from "./TrackApplication";
import OfficerLogin from "./OfficerLogin";
import OfficerDashboard from "./OfficerDashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const [applicationData, setApplicationData] = useState(null);

  const goHome = () => {
    setCurrentPage("home");
  };

  const handleApply = () => {
    setCurrentPage("apply");
  };

  const handleTrack = () => {
    setCurrentPage("track");
  };

  const handleOfficerLogin = () => {
    setCurrentPage("officer-login");
  };

  const handleOfficerLoggedIn = () => {
    setCurrentPage("officer");
  };

  const handleProceedToPayment = (data) => {
    setApplicationData(data);
    setCurrentPage("payment");
  };

  const handlePaymentBack = () => {
    setCurrentPage("apply");
  };

  const handleOfficerBack = () => {
    setCurrentPage("home");
  };

  const handleOfficerLogout = () => {
    setCurrentPage("home");
  };

  /* =======================================================
     HOME
     ======================================================= */

  if (currentPage === "home") {
    return (
      <div className="app">

        {/* NAVBAR */}
        <header className="main-navbar">
          <div className="navbar-inner">

            <button
              type="button"
              className="brand"
              onClick={goHome}
            >
              <div className="brand-icon">
                LR
              </div>

              <div className="brand-text">
                <strong>
                  Land Registration
                </strong>

                <span>
                  Government Services Portal
                </span>
              </div>
            </button>

            <nav className="main-nav">

              <button
                type="button"
                className="nav-link active"
                onClick={goHome}
              >
                Home
              </button>

              <button
                type="button"
                className="nav-link"
                onClick={handleApply}
              >
                Apply
              </button>

              <button
                type="button"
                className="nav-link"
                onClick={handleTrack}
              >
                Track Application
              </button>

              <button
                type="button"
                className="officer-nav-link"
                onClick={handleOfficerLogin}
              >
                Officer Login
              </button>

            </nav>
          </div>
        </header>


        {/* HERO */}
        <main>

          <section className="hero-section">

            <div className="hero-inner">

              <div className="hero-content">

                <div className="hero-badge">
                  <span className="hero-badge-dot"></span>

                  DIGITAL LAND REGISTRATION
                </div>

                <h1>
                  Secure & Transparent
                  <br />

                  <span>
                    Land Registration
                  </span>
                </h1>

                <p>
                  Apply for land registration online,
                  securely submit your documents,
                  complete payment and track your
                  application from submission to
                  registration.
                </p>

                {/* ONLY ONE HERO ACTION */}
                <div className="hero-actions">

                  <button
                    type="button"
                    className="primary-hero-btn"
                    onClick={handleApply}
                  >
                    Start New Application
                    <span>→</span>
                  </button>

                </div>

                <div className="hero-trust">

                  <div className="trust-item">
                    <span className="trust-icon">
                      ✓
                    </span>

                    <span>
                      Secure Submission
                    </span>
                  </div>

                  <div className="trust-item">
                    <span className="trust-icon">
                      ✓
                    </span>

                    <span>
                      Online Tracking
                    </span>
                  </div>

                  <div className="trust-item">
                    <span className="trust-icon">
                      ✓
                    </span>

                    <span>
                      Transparent Process
                    </span>
                  </div>

                </div>

              </div>


              {/* HERO VISUAL */}
              <div className="hero-visual">

                <div className="hero-card">

                  <div className="hero-card-top">

                    <div className="hero-card-icon">
                      LR
                    </div>

                    <div>
                      <strong>
                        Land Registration
                      </strong>

                      <span>
                        Digital Service
                      </span>
                    </div>

                  </div>


                  <div className="hero-document">

                    <div className="document-line large"></div>
                    <div className="document-line"></div>
                    <div className="document-line short"></div>

                    <div className="document-grid">

                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>

                    </div>

                    <div className="document-seal">
                      ✓
                    </div>

                  </div>


                  <div className="hero-card-footer">

                    <span>
                      VERIFIED DOCUMENT
                    </span>

                    <strong>
                      SECURE
                    </strong>

                  </div>

                </div>


                <div className="floating-card floating-card-one">

                  <span className="floating-icon">
                    ✓
                  </span>

                  <div>
                    <strong>
                      Secure
                    </strong>

                    <small>
                      Document Handling
                    </small>
                  </div>

                </div>


                <div className="floating-card floating-card-two">

                  <span className="floating-icon">
                    ◷
                  </span>

                  <div>
                    <strong>
                      Online Tracking
                    </strong>

                    <small>
                      Check status anytime
                    </small>
                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* SERVICES */}
          <section className="features-section">

            <div className="section-container">

              <div className="section-heading">

                <span>
                  OUR SERVICES
                </span>

                <h2>
                  Everything you need in one portal
                </h2>

                <p>
                  A simple digital process designed to
                  make land registration easier,
                  faster and more transparent.
                </p>

              </div>


              <div className="feature-grid">

                <div className="feature-card">

                  <div className="feature-icon">
                    01
                  </div>

                  <h3>
                    Online Application
                  </h3>

                  <p>
                    Submit your land registration
                    application online without visiting
                    the office to start the process.
                  </p>

                </div>


                <div className="feature-card">

                  <div className="feature-icon">
                    02
                  </div>

                  <h3>
                    Secure Documents
                  </h3>

                  <p>
                    Upload required ownership and
                    identity documents securely with
                    your application.
                  </p>

                </div>


                <div className="feature-card">

                  <div className="feature-icon">
                    03
                  </div>

                  <h3>
                    Application Tracking
                  </h3>

                  <p>
                    Use your Application ID to check
                    the current status of your
                    registration request.
                  </p>

                </div>


                <div className="feature-card">

                  <div className="feature-icon">
                    04
                  </div>

                  <h3>
                    Officer Verification
                  </h3>

                  <p>
                    Authorized officers can review
                    applications and verify submitted
                    documents.
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* PROCESS */}
          <section className="process-section">

            <div className="section-container">

              <div className="section-heading">

                <span>
                  HOW IT WORKS
                </span>

                <h2>
                  Simple process from application to registration
                </h2>

              </div>


              <div className="process-grid">

                <div className="process-step">

                  <div className="process-number">
                    01
                  </div>

                  <h3>
                    Apply Online
                  </h3>

                  <p>
                    Enter applicant and land details
                    through the online application form.
                  </p>

                </div>


                <div className="process-connector"></div>


                <div className="process-step">

                  <div className="process-number">
                    02
                  </div>

                  <h3>
                    Upload Documents
                  </h3>

                  <p>
                    Submit the required ownership and
                    identity documents.
                  </p>

                </div>


                <div className="process-connector"></div>


                <div className="process-step">

                  <div className="process-number">
                    03
                  </div>

                  <h3>
                    Complete Payment
                  </h3>

                  <p>
                    Complete the application payment
                    step and receive your Application ID.
                  </p>

                </div>


                <div className="process-connector"></div>


                <div className="process-step">

                  <div className="process-number">
                    04
                  </div>

                  <h3>
                    Verification & Registration
                  </h3>

                  <p>
                    The officer verifies the application
                    and completes registration.
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* TRACKING CTA */}
          <section className="home-cta-section">

            <div className="home-cta-inner">

              <div>

                <span>
                  ALREADY SUBMITTED?
                </span>

                <h2>
                  Check your application status
                </h2>

                <p>
                  Enter your Application ID to view
                  the latest status and registration
                  progress.
                </p>

              </div>


              <button
                type="button"
                onClick={handleTrack}
              >
                Track Existing Application
                <span>→</span>
              </button>

            </div>

          </section>

        </main>


        {/* FOOTER */}
        <footer className="main-footer">

          <div className="footer-inner">

            <div className="footer-brand">

              <div className="brand-icon">
                LR
              </div>

              <div>
                <strong>
                  Land Registration Portal
                </strong>

                <span>
                  Digital Government Service
                </span>
              </div>

            </div>


            <div className="footer-links">

              <button
                type="button"
                onClick={goHome}
              >
                Home
              </button>

              <button
                type="button"
                onClick={handleOfficerLogin}
              >
                Officer Login
              </button>

            </div>

          </div>


          <div className="footer-bottom">

            <span>
              © {new Date().getFullYear()} Land Registration Portal
            </span>

            <span>
              Secure • Transparent • Digital
            </span>

          </div>

        </footer>

      </div>
    );
  }


  /* =======================================================
     APPLICATION FORM
     ======================================================= */

  if (currentPage === "apply") {
    return (
      <ApplicationForm
        onProceedToPayment={handleProceedToPayment}
        onBack={goHome}
      />
    );
  }


  /* =======================================================
     PAYMENT
     ======================================================= */

  if (currentPage === "payment") {
    return (
      <PaymentPage
        applicationData={applicationData}
        onBack={handlePaymentBack}
        onHome={goHome}
      />
    );
  }


  /* =======================================================
     TRACK APPLICATION
     ======================================================= */

  if (currentPage === "track") {
    return (
      <TrackApplication
        onBack={goHome}
      />
    );
  }


  /* =======================================================
     OFFICER LOGIN
     ======================================================= */

  if (currentPage === "officer-login") {
    return (
      <OfficerLogin
        onLogin={handleOfficerLoggedIn}
        onBack={handleOfficerBack}
      />
    );
  }


  /* =======================================================
     OFFICER DASHBOARD
     ======================================================= */

  if (currentPage === "officer") {
    return (
      <OfficerDashboard
        onBack={handleOfficerBack}
        onLogout={handleOfficerLogout}
      />
    );
  }


  return null;
}

export default App;