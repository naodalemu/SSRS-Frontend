import { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import classes from "./SignUpLogIn.module.css";
import { Link, useNavigate } from "react-router-dom";
import { TiHome } from "react-icons/ti";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email_to_verify");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setSuccess(<>Email Verified successfully!</>);
      setTimeout(() => {
        localStorage.removeItem("email_to_verify")
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.message || "Something went wrong");
      console.log(error)
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
          <h1 className={classes.headerText}>Verify Email</h1>
          <p className={classes.loginOp}>
            We have sent you OTP code in your email! Please verify your email by
            pasting it in the input field below
          </p>
        </div>

        {error && <p className={classes.errorMessage}>{error}</p>}
        {success && <p className={classes.successMessage}>{success}</p>}

        <form className={classes.form}>
          <input
            type="number"
            placeholder="OTP Code"
            className={classes.inputField}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            className={classes.button}
            disabled={loading || otp === ""}
            onClick={handleSubmit}
          >
            {loading ? "Verifying account..." : "Verify"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default VerifyEmail;
