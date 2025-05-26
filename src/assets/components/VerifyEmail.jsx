import { useState, useEffect } from "react";
import { FaEnvelope, FaKey, FaArrowLeft, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import classes from "./ResetPassword.module.css";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("email_to_verify");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email found, redirect to signup
      navigate("/user-profile");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp) {
      setError("OTP code is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        localStorage.removeItem("email_to_verify");
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <div className={classes.header}>
          <div className={classes.icon}>
            <FaEnvelope />
          </div>
          <h1>Verify Email</h1>
          <p>Enter the OTP code sent to your email</p>
        </div>

        <div className={classes.content}>
          {error && <div className={classes.errorMessage}>{error}</div>}
          {success && <div className={classes.successMessage}>{success}</div>}

          <form onSubmit={handleSubmit} className={classes.form}>
            <div className={classes.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={classes.inputWrapper}>
                <FaEnvelope className={classes.inputIcon} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  disabled
                  className={classes.disabledInput}
                />
              </div>
            </div>

            <div className={classes.inputGroup}>
              <label htmlFor="otp">OTP Code</label>
              <div className={classes.inputWrapper}>
                <FaKey className={classes.inputIcon} />
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP code"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !otp}
              className={classes.submitButton}
            >
              {loading ? (
                <>
                  <div className={classes.spinner}></div>
                  Verifying...
                </>
              ) : (
                <>
                  <FaCheck />
                  Verify Email
                </>
              )}
            </button>
          </form>

          <div className={classes.footer}>
            <button
              onClick={() => navigate("/signup")}
              className={classes.backButton}
            >
              <FaArrowLeft />
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
