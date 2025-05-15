import React, { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import classes from "./SignUpLogIn.module.css";
import { Link, useNavigate } from "react-router-dom";
import { TiHome } from "react-icons/ti";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
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
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },        
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      setSuccess(
        <>
          Account created successfully!
          Redirecting in 3 seconds!
        </>
      );
      setTimeout(() => {
        localStorage.setItem("email_to_verify", formData.email);
        navigate("/verify-email");
      }, 3000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={classes.signupLogin}>
      <div className={classes.leftCarousel}>
        <Splide
          aria-label="Food Images"
          options={{
            rewind: true,
            gap: "1rem",
            autoplay: true,
            interval: 5000,
            arrows: false,
            type: "loop",
            heightRatio: 0.9,
            autoHeight: true,
            autoWidth: true,
            pagination: true,
          }}
          className={classes.splide}
        >
          <SplideSlide>
            <div className={classes.slideContent}>
              <img
                src="src/assets/images/Have Customized Order.jpg"
                alt="Buffalo Wings"
                className={classes.slideImage}
              />
              <div className={classes.textOverlay}>
                <h2>
                  Have a <br />
                  Customized <br />
                  Order Call
                </h2>
              </div>
            </div>
          </SplideSlide>
          <SplideSlide>
            <div className={classes.slideContent}>
              <img
                src="src/assets/images/Start Getting Your Order History.jpg"
                alt="Carrot Juice"
                className={classes.slideImage}
              />
              <div className={classes.textOverlay}>
                <h2>
                  Start Getting <br />
                  Your Order <br />
                  History
                </h2>
              </div>
            </div>
          </SplideSlide>
          <SplideSlide>
            <div className={classes.slideContent}>
              <img
                src="src/assets/images/Alternate Black.jpg"
                alt="Grilled Salmon"
                className={classes.slideImage}
              />
              <div className={classes.textOverlay}>
                <h2>
                  Experience <br />
                  Amazing <br />
                  Food
                </h2>
              </div>
            </div>
          </SplideSlide>
        </Splide>
      </div>
      <div className={classes.rightContent}>
        <div className={classes.headerContainer}>
          <h1 className={classes.headerText}>Create an account</h1>
          <p className={classes.loginOp}>
            Already have an account?{" "}
            <Link to="/login">
              <span className={classes.loginLink}>Log in</span>
            </Link>
          </p>
        </div>

        {error && <p className={classes.errorMessage}>{error}</p>}
        {success && <p className={classes.successMessage}>{success}</p>}

        <form className={classes.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className={classes.inputField}
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className={classes.inputField}
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={classes.inputField}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={classes.inputField}
            required
          />

          <button type="submit" className={classes.button} disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
      <Link to="/menu">
        <div className={classes.backToHome}>
          <p className={classes.backToHomeTextnIcon}>
            <TiHome />
            <span className={classes.backToHomeTextOnly}>Back To Home</span>
          </p>
        </div>
      </Link>
    </section>
  );
}

export default SignUp;
