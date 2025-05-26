import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaCheck,
  FaKey,
  FaBrain,
} from "react-icons/fa";
import classes from "./SignUpLogIn.module.css";
import { FaFlorinSign } from "react-icons/fa6";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.access_token);

      setSuccess("Successfully logged in! Redirecting to the main page...");
      setTimeout(() => {
        navigate("/");
      }, 1000);
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
            <FaLock />
          </div>
          <h1>Log In</h1>
          <p>Enter your email and password to log in</p>
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className={classes.submitButton}
            >
              {loading ? (
                <>
                  <div className={classes.spinner}></div>
                  Logging In...
                </>
              ) : (
                <>
                  <FaCheck />
                  Log In
                </>
              )}
            </button>
          </form>

          <div className={classes.footer}>
            <Link to="/forget-password" className={classes.backButton}>
              Forgot Password?
            </Link>
            <Link to="/signup" className={classes.backButton}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
