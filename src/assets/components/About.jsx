import React, { useState, useEffect } from "react";
import classes from "./About.module.css";
import { Link } from "react-router-dom";

function About() {
  return (
    <section className={classes.heroSection}>
      <div className={classes.overlay}>
        <div className={classes.scrollableContainer}>
          <div className={classes.headerContainer}>
            <div className={classes.headerTextPart}>
              <h1 className={classes.heroContent}>About Us</h1>
              <h2 className={classes.description}>
                Welcome to SSR, where passion meets flavor!
              </h2>
            </div>
            <div>
              <Link to="/feedback" className={classes.feedbackButton}>
                Give Us Feedback
              </Link>
            </div>
          </div>
          <p className={classes.text}>
            At SSR, we believe that dining is more than just
            eating—it's an experience. From the moment you step through our
            doors, you'll be greeted with the warm aroma of freshly prepared
            dishes, the sound of laughter, and the sight of beautifully crafted
            meals that are as delightful to the eyes as they are to the palate.
            Our journey began with a simple mission: to bring people together
            over great food. Whether you're here for a casual lunch, a romantic
            dinner, or a celebration with friends and family, we strive to make
            every moment special.
          </p>
          <div className={classes.imageContainer}>
            <div
              className={classes.images}
              style={{
                background: `url(https://www.fda.gov/files/buffet3.jpg)`,
              }}
            />
            <div
              className={classes.images}
              style={{
                background: `url(https://media.istockphoto.com/id/949988530/photo/modern-restaurant-terrace-in-the-summer.jpg?s=612x612&w=0&k=20&c=ddRUiyKEsrhRpTc7TRd4Op4GbSWnK2W-GARXF8ioenI=)`,
              }}
            />
            <div
              className={classes.images}
              style={{
                background: `url(https://media.timeout.com/images/106108201/750/422/image.jpg)`,
              }}
            />
            <div
              className={classes.images}
              style={{
                background: `url(https://www.statesman.com/gcdn/presto/2021/08/20/NA36/a6bda363-9c69-41ea-8d7d-eb46f4007907-summerhousesimonite.jpg?width=660&height=440&fit=crop&format=pjpg&auto=webp)`,
              }}
            />
            <div
              className={classes.images}
              style={{
                background: `url(https://images.bauerhosting.com/celebrity/sites/3/2022/08/Screenshot-2022-08-04-at-15.30.40-1.png?auto=format&w=1440&q=80)`,
              }}
            />
            <div
              className={classes.images}
              style={{
                background: `url(https://i.pinimg.com/736x/7e/6c/77/7e6c77d37f1c93cfa24bee5482147d41.jpg)`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
