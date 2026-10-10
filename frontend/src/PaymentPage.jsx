import { useState } from "react";
import "./PaymentPage.css";

function PaymentPage({ applicationData, onBack }) {
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const paymentAmount = 1000000;

  const formattedAmount = paymentAmount.toLocaleString("en-IN");

  if (!applicationData) {
    return (
      <div className="payment-page">
        <div className="payment-container payment-empty">

          <div className="payment-empty-icon">!</div>

          <h1>No Application Data</h1>

          <p>
            Your application information could not be found.
            Please return to the application page and try again.
          </p>

          <button
            type="button"
            className="back-btn"
            onClick={onBack}
          >
            ← Back to Home
          </button>

        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setPaymentProcessing(true);
    setError("");

    try {
      const paymentReference =
        "DEMO-PAY-" + Date.now();

      const formData = new FormData();

      const application = {
        applicantName: applicationData.applicantName,
        mobile: applicationData.mobile,
        email: applicationData.email,
        governmentId: applicationData.governmentId,

        surveyNumber: applicationData.surveyNumber,
        landArea: applicationData.landArea,
        village: applicationData.village,
        mandal: applicationData.mandal,
        district: applicationData.district,
        landType: applicationData.landType,

        ownerName: applicationData.ownerName,
        ownerId: applicationData.ownerId,

        paymentReference: paymentReference,
      };

      formData.append(
        "application",
        new Blob(
          [JSON.stringify(application)],
          {
            type: "application/json",
          }
        )
      );

      if (applicationData.saleDeed) {
        formData.append(
          "saleDeed",
          applicationData.saleDeed
        );
      }

      if (applicationData.identityProof) {
        formData.append(
          "identityProof",
          applicationData.identityProof
        );
      }

      if (applicationData.additionalDocument) {
        formData.append(
          "additionalDocument",
          applicationData.additionalDocument
        );
      }

      const response = await fetch(
        "/api/applications",
        {
          method: "POST",
          body: formData,
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        setError(
          typeof data === "string"
            ? data
            : data.error ||
              "Could not submit the application."
        );

        return;
      }

      setApplicationId(data.applicationId);
      setPaymentCompleted(true);

    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to the Java server. Make sure Spring Boot is running."
      );

    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCopyApplicationId = async () => {
    try {
      await navigator.clipboard.writeText(
        applicationId
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error(error);
    }
  };

  /* =====================================================
     SUCCESS SCREEN
  ===================================================== */

  if (paymentCompleted) {
    return (
      <div className="payment-page">

        <div className="payment-container payment-success-container">

          <div className="success-top-badge">
            <span>✓</span>
            Application Submitted
          </div>

          <div className="payment-success-icon">
            ✓
          </div>

          <h1>
            Application Submitted Successfully
          </h1>

          <p className="success-message">
            Your payment has been recorded and your
            land registration application has been
            successfully submitted for verification.
          </p>

          {/* APPLICATION ID */}

          <div className="application-id-card">

            <div className="application-id-heading">
              <span>APPLICATION ID</span>

              <small>
                Keep this ID safe
              </small>
            </div>

            <div className="application-id-value">
              <strong>
                {applicationId}
              </strong>

              <button
                type="button"
                className="copy-id-btn"
                onClick={handleCopyApplicationId}
              >
                {copied ? "✓ Copied" : "Copy ID"}
              </button>
            </div>

          </div>

          <div className="success-instructions">

            <div className="instruction-item">
              <div className="instruction-number">
                1
              </div>

              <div>
                <strong>Save your Application ID</strong>
                <p>
                  You will need this ID to track your
                  application status.
                </p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-number">
                2
              </div>

              <div>
                <strong>Application verification</strong>
                <p>
                  Your application will be reviewed by
                  the registration officer.
                </p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-number">
                3
              </div>

              <div>
                <strong>Track your application</strong>
                <p>
                  Use the Application ID from the home
                  page to check your status.
                </p>
              </div>
            </div>

          </div>

          <div className="success-payment-info">

            <div>
              <span>Payment Status</span>
              <strong>Paid</strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>
                ₹{formattedAmount}
              </strong>
            </div>

            <div>
              <span>Application Status</span>
              <strong>
                Under Verification
              </strong>
            </div>

          </div>

          <button
            type="button"
            className="back-btn success-home-btn"
            onClick={onBack}
          >
            Back to Home
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     PAYMENT SCREEN
  ===================================================== */

  return (
    <div className="payment-page">

      <div className="payment-container">

        {/* BACK */}

        <button
          type="button"
          className="back-link"
          onClick={onBack}
          disabled={paymentProcessing}
        >
          ← Back to Application
        </button>

        {/* HEADER */}

        <div className="payment-header">

          <div className="payment-header-icon">
            ₹
          </div>

          <div>
            <h1>Complete Payment</h1>

            <p className="payment-subtitle">
              Review your application details and
              complete the payment to submit your
              application.
            </p>
          </div>

        </div>

        {/* PROGRESS */}

        <div className="payment-progress">

          <div className="payment-progress-step completed">
            <div>✓</div>
            <span>Application</span>
          </div>

          <div className="payment-progress-line active"></div>

          <div className="payment-progress-step current">
            <div>2</div>
            <span>Payment</span>
          </div>

          <div className="payment-progress-line"></div>

          <div className="payment-progress-step">
            <div>3</div>
            <span>Complete</span>
          </div>

        </div>

        {/* MAIN PAYMENT GRID */}

        <div className="payment-layout">

          {/* APPLICATION SUMMARY */}

          <div className="payment-details">

            <div className="payment-section-heading">

              <div className="payment-section-icon">
                ✓
              </div>

              <div>
                <h2>Application Summary</h2>
                <p>
                  Verify the details before payment.
                </p>
              </div>

            </div>

            <div className="payment-summary-list">

              <div className="payment-row">
                <span>Applicant Name</span>
                <strong>
                  {applicationData.applicantName}
                </strong>
              </div>

              <div className="payment-row">
                <span>Mobile Number</span>
                <strong>
                  {applicationData.mobile}
                </strong>
              </div>

              <div className="payment-row">
                <span>Survey Number</span>
                <strong>
                  {applicationData.surveyNumber}
                </strong>
              </div>

              <div className="payment-row">
                <span>Land Area</span>
                <strong>
                  {applicationData.landArea}
                </strong>
              </div>

              <div className="payment-row">
                <span>Land Type</span>
                <strong>
                  {applicationData.landType}
                </strong>
              </div>

              <div className="payment-row">
                <span>Village</span>
                <strong>
                  {applicationData.village}
                </strong>
              </div>

              <div className="payment-row">
                <span>Mandal / Taluk</span>
                <strong>
                  {applicationData.mandal}
                </strong>
              </div>

              <div className="payment-row">
                <span>District</span>
                <strong>
                  {applicationData.district}
                </strong>
              </div>

            </div>

            <div className="documents-status">

              <div className="documents-status-icon">
                ✓
              </div>

              <div>
                <strong>Documents attached</strong>

                <p>
                  Required documents will be submitted
                  along with your application.
                </p>
              </div>

            </div>

          </div>

          {/* PAYMENT CARD */}

          <div className="payment-box">

            <div className="payment-box-top">

              <span className="payment-label">
                REGISTRATION PAYMENT
              </span>

              <span className="demo-badge">
                DEMO
              </span>

            </div>

            <div className="payment-amount-label">
              Total Amount
            </div>

            <div className="payment-amount">
              ₹{formattedAmount}
            </div>

            <div className="amount-description">
              Land Registration Payment Amount
            </div>

            <div className="payment-divider"></div>

            <div className="amount-breakdown">

              <div>
                <span>Registration Amount</span>
                <strong>
                  ₹{formattedAmount}
                </strong>
              </div>

              <div>
                <span>Processing Fee</span>
                <strong>
                  ₹0
                </strong>
              </div>

              <div className="amount-total">
                <span>Total Payable</span>
                <strong>
                  ₹{formattedAmount}
                </strong>
              </div>

            </div>

            <div className="demo-payment-notice">

              <div className="notice-icon">
                i
              </div>

              <div>
                <strong>College Project Demo</strong>

                <p>
                  This is a simulated payment. No real
                  money will be charged.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="pay-btn"
              onClick={handlePayment}
              disabled={paymentProcessing}
            >
              {paymentProcessing ? (
                <>
                  <span className="payment-spinner"></span>
                  Processing Application...
                </>
              ) : (
                <>
                  Pay ₹{formattedAmount}
                  <span>→</span>
                </>
              )}
            </button>

            <div className="secure-payment-note">
              <span>✓</span>
              Secure demo transaction
            </div>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="payment-error">

            <div className="payment-error-icon">
              !
            </div>

            <div>
              <strong>
                Submission Failed
              </strong>

              <p>
                {error}
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default PaymentPage;