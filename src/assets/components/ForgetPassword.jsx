import { useState, useEffect } from "react";
import { FaEnvelope, FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import classes from "./ForgetPassword.module.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("email_to_reset");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_BASE_URL;

      const response = await fetch(`${baseUrl}/api/customer/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to send reset token");
      }

      // Store email for reset password page
      localStorage.setItem("email_to_reset", email);

      setSuccess(
        "Reset token sent successfully! Redirecting to reset password page..."
      );

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to send reset token");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <div className={classes.header}>
          <div className={classes.icon}>
            <FaEnvelope />
          </div>
          <h1>Forgot Password</h1>
          <p>Enter your email address and we'll send you a reset token</p>
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
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className={classes.submitButton}
            >
              {loading ? (
                <>
                  <div className={classes.spinner}></div>
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send Reset Token
                </>
              )}
            </button>
          </form>

          <div className={classes.footer}>
            <button onClick={handleBackToLogin} className={classes.backButton}>
              <FaArrowLeft />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
