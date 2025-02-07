import classes from "./Testimonials.module.css";
import TestimonialsCard from "./TestimonialsCard";

function Testimonials() {
  const testimonialData = [
    {
      rating: "5",
      description:
        "From the moment I took a single bite, I was transported to a very beautiful and euphoric mental place. Impressive chefs. Totally a 5/5.",
      image: "brittany_heralds",
      name: "Brittany Heralds",
      position: "Chef",
    },
    {
      rating: "5",
      description:
        "Food is something I go to when I want a peaceful time I can get nowhere else, and you bet anything this is my favourite place that makes the best food I know!",
      image: "jake_paralta",
      name: "Jake Paralta",
      position: "Food Enthusiast",
    },
    {
      rating: "4.5",
      description:
        "You know that moment when you are full but you don’t want to stop eating because you know you are going to miss the taste later? That’s always my situation here!",
      image: "mark_stanley",
      name: "Mark Stanley",
      position: "Customer",
    },
  ];

  return (
    <section className={classes.testimonialsSection}>
      <p className={classes.hint}>WHAT OUR CUSTOMERS SAY</p>
      <p className={classes.header}>CUSTOMER SAYS</p>
      <p className={classes.sectionDescription}>Check out what our customers say about our foods and services. Consider experiencing these tastes on your own!</p>
      <div className={classes.testimonialContainer}>
        {testimonialData.map((item) => (
          <TestimonialsCard
            key={item.description}
            rating={item.rating}
            description={item.description}
            testimonyImage={item.image}
            name={item.name}
            position={item.position}
          />
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
