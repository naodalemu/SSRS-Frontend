import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import classes from "./SignUpLogIn.module.css";
import { Link } from "react-router-dom";
import { TiHome } from "react-icons/ti";

function LogIn() {
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

        <form className={classes.form}>
          <input
            type="email"
            placeholder="Email Address"
            className={classes.inputField}
          />
          <input
            type="password"
            placeholder="Password"
            className={classes.inputField}
          />

          <div className={classes.checkboxContainer}>
            <input type="checkbox" id="remember" className={classes.checkbox} />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className={classes.button}>
            Log In
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
      <Link to="/">
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
