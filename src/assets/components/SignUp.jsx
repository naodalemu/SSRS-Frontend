import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/react-splide/css';
import classes from "./SignUp.module.css";

function SignUp() {
  return (
    <section className={classes.signup}>
      <div className="left-carousel" style={{ width: "48%", borderRadius: "10px", overflow: "hidden", }}>
        <Splide aria-label="My Favorite Images" options={{rewind: true, gap: '1rem', autoplay: true, interval: 5000, arrows: false, type: "loop", heightRatio: 0.9, autoHeight: true, autoWidth: true, pagination: true,}} className={classes.splide} >
          <SplideSlide>
            <img src="src/assets/images/buffalo_wings.jpg" alt="Image 1" className={classes.slideImage} />
          </SplideSlide>
          <SplideSlide>
            <img src="src/assets/images/carrot_juice.jpg" alt="Image 2" className={classes.slideImage} />
          </SplideSlide>
          <SplideSlide>
            <img src="src/assets/images/grilled_salmon.jpg" alt="Image 3" className={classes.slideImage} />
          </SplideSlide>
        </Splide>
      </div>
      <div className="right-content"></div>
    </section>
  );
}

export default SignUp;
