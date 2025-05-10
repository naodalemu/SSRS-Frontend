import { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import classes from "./SignUpLogIn.module.css";
import { Link, useNavigate } from "react-router-dom";
import { TiHome } from "react-icons/ti";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log(data);

      // Save the auth token to localStorage
      localStorage.setItem("auth_token", data.access_token);

      // Show success message
      setSuccess(<>Successfully logged in! Redirecting to the main page!</>);

      // Redirect to the main page after a delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Something went wrong");
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
          <h1 className={classes.headerText}>Log In</h1>
          <p className={classes.loginOp}>
            Don't have an account?{" "}
            <Link to="/signup">
              <span className={classes.loginLink}>Create Account</span>
            </Link>
          </p>
        </div>

        {error && <p className={classes.errorMessage}>{error}</p>}
        {success && <p className={classes.successMessage}>{success}</p>}

        <form className={classes.form}>
          <input
            type="email"
            placeholder="Email Address"
            className={classes.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={classes.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={classes.checkboxContainer}>
            <Link to="/forgot-password">Forgot Password</Link>
          </div>

          <button
            type="submit"
            className={classes.button}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>

          <div className={classes.orDivider}>
            <span>Or log in with</span>
          </div>

          <button className={classes.googleButton}>
            <img src="src/assets/images/Google.png" alt="Google" />
            Google
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

export default LogIn;
