import { useState, useEffect } from "react";
import {
  FaLock,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import classes from "./ResetPassword.module.css";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("email_to_reset");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    } else {
      // If no email found, redirect to forgot password
      navigate("/forgot-password");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (!formData.token) {
      setError("Reset token is required");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (!formData.password_confirmation) {
      setError("Password confirmation is required");
      return false;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const baseUrl = import.meta.env.VITE_BASE_URL;

      const response = await fetch(`${baseUrl}/api/customer/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      // Clear email from localStorage
      localStorage.removeItem("email_to_reset");

      setSuccess("Password reset successfully! Redirecting to login page...");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "" };

    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthTexts = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return { strength, text: strengthTexts[strength - 1] || "" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <div className={classes.header}>
          <div className={classes.icon}>
            <FaLock />
          </div>
          <h1>Reset Password</h1>
          <p>Enter your reset token and new password</p>
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
                  value={formData.email}
                  disabled
                  className={classes.disabledInput}
                />
              </div>
            </div>

            <div className={classes.inputGroup}>
              <label htmlFor="token">Reset Token</label>
              <div className={classes.inputWrapper}>
                <FaKey className={classes.inputIcon} />
                <input
                  type="text"
                  id="token"
                  name="token"
                  value={formData.token}
                  onChange={handleInputChange}
                  placeholder="Enter the reset token from your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className={classes.inputGroup}>
              <label htmlFor="password">New Password</label>
              <div className={classes.inputWrapper}>
                <FaLock className={classes.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  required
                  minLength="6"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={classes.eyeButton}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.password && (
                <div className={classes.passwordStrength}>
                  <div
                    className={`${classes.strengthBar} ${
                      classes[`strength${passwordStrength.strength}`]
                    }`}
                  >
                    <div className={classes.strengthFill}></div>
                  </div>
                  <span className={classes.strengthText}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
            </div>

            <div className={classes.inputGroup}>
              <label htmlFor="password_confirmation">
                Confirm New Password
              </label>
              <div className={classes.inputWrapper}>
                <FaLock className={classes.inputIcon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={classes.eyeButton}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.password_confirmation &&
                formData.password === formData.password_confirmation && (
                  <div className={classes.passwordMatch}>
                    <FaCheck /> Passwords match
                  </div>
                )}
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !formData.token ||
                !formData.password ||
                !formData.password_confirmation
              }
              className={classes.submitButton}
            >
              {loading ? (
                <>
                  <div className={classes.spinner}></div>
                  Resetting...
                </>
              ) : (
                <>
                  <FaCheck />
                  Reset Password
                </>
              )}
            </button>
          </form>

          <div className={classes.footer}>
            <button onClick={() => {navigate("/forget-password")}} className={classes.backButton}>
              <FaArrowLeft />
              Not Your Email?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
