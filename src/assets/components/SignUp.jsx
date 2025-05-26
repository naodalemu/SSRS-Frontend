import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
import classes from "./ResetPassword.module.css";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        localStorage.setItem("email_to_verify", formData.email);
        navigate("/verify-email");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
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
            <FaUser />
          </div>
          <h1>Sign Up</h1>
          <p>Create an account to get started</p>
        </div>

        <div className={classes.content}>
          {error && <div className={classes.errorMessage}>{error}</div>}
          {success && <div className={classes.successMessage}>{success}</div>}

          <form onSubmit={handleSubmit} className={classes.form}>
            <div className={classes.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <div className={classes.inputWrapper}>
                <FaUser className={classes.inputIcon} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className={classes.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={classes.inputWrapper}>
                <FaEnvelope className={classes.inputIcon} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className={classes.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={classes.inputWrapper}>
                <FaLock className={classes.inputIcon} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
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

            <div className={classes.inputGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={classes.inputWrapper}>
                <FaLock className={classes.inputIcon} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !formData.name ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword
              }
              className={classes.submitButton}
            >
              {loading ? (
                <>
                  <div className={classes.spinner}></div>
                  Signing Up...
                </>
              ) : (
                <>
                  <FaCheck />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className={classes.footer}>
            <Link to="/login" className={classes.backButton}>
              <FaArrowLeft />
              Already have an account? Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
