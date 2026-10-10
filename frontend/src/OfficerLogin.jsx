import { useState } from "react";
import "./OfficerLogin.css";

function OfficerLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/officer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Invalid username or password."
        );
        return;
      }

      onLogin();
    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to the Java server. Make sure Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="officer-login-page">
      <div className="officer-login-wrapper">

        <button
          type="button"
          className="officer-back-link"
          onClick={onBack}
        >
          <span>←</span>
          Back to Home
        </button>

        <div className="officer-login-card">

          <div className="officer-login-top">
            <div className="officer-login-icon">
              <span>LR</span>
            </div>

            <div className="officer-login-badge">
              <span className="secure-dot"></span>
              SECURE ACCESS
            </div>

            <h1>Officer Portal</h1>

            <p>
              Authorized registration officers can sign in to
              review and process land registration applications.
            </p>
          </div>

          <div className="officer-divider"></div>

          <form
            className="officer-login-form"
            onSubmit={handleSubmit}
          >

            <div className="officer-form-group">
              <label htmlFor="officer-username">
                Username
              </label>

              <div className="officer-input-wrapper">
                <span className="officer-input-icon">
                  ◉
                </span>

                <input
                  id="officer-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  autoComplete="username"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="officer-form-group">
              <label htmlFor="officer-password">
                Password
              </label>

              <div className="officer-input-wrapper">
                <span className="officer-input-icon">
                  ◆
                </span>

                <input
                  id="officer-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="officer-login-error">
                <div className="officer-error-icon">
                  !
                </div>

                <div>
                  <strong>Login unsuccessful</strong>

                  <p>{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="officer-login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="officer-login-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign in to Officer Portal</span>
                  <span className="officer-login-arrow">
                    →
                  </span>
                </>
              )}
            </button>

          </form>

          <div className="officer-security-note">
            <div className="security-note-icon">
              ✓
            </div>

            <div>
              <strong>Authorized access only</strong>

              <p>
                This portal is intended for authorized
                registration officers. Please keep your
                login credentials confidential.
              </p>
            </div>
          </div>

        </div>

        <div className="officer-login-footer">
          <span>Land Registration Portal</span>
          <span className="footer-separator">•</span>
          <span>Officer Access</span>
        </div>

      </div>
    </div>
  );
}

export default OfficerLogin;