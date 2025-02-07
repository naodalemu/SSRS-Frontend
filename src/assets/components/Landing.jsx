import classes from "./Landing.module.css"
import Hero from "./Hero";
import Gallery from "./Gallery";
import Testimonials from "./Testimonials";
import Quote from "./Quote";
import Contact from "./Contact";

function Landing() {
    return (
        <section className={classes.landing}>
            <Hero />
            <Gallery type="food" />
            <Gallery type="drink" />
            <Testimonials />
            <Quote />
            <Contact />
        </section>
    )
}

export default Landing;