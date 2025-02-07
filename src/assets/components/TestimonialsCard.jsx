import React from "react";
import classes from "./TestimonialsCard.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import images from '../images';

function TestimonialsCard({
  rating,
  description,
  testimonyImage,
  name,
  position,
}) {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className={classes.starIcon} />
        ))}
        {hasHalfStar && <FaStarHalfAlt className={classes.starIcon} />}
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} className={classes.starIcon} />
        ))}
      </>
    );
  };

  return (
    <section className={classes.testimonialCardContainer}>
      <div className={classes.contentContainer}>
        <div className={classes.ratingContainer}>
          {renderStars(parseFloat(rating))}
          <span className={classes.ratingInNumber}>{rating}/5</span>
        </div>
        <p className={classes.description}>{description}</p>
      </div>
      <div className={classes.identity}>
        <div className={classes.testimonialImage} style={{ backgroundImage: `url(${images[testimonyImage]})` }}/>
        <div className={classes.textIdentity}>
          <h3>{name}</h3>
          <p className={classes.positionText}>{position}</p>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsCard;
