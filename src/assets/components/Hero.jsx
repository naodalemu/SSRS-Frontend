import classes from "./Hero.module.css"
import { FaArrowDown } from "react-icons/fa6";
import burgerImage from "../images/burger_no_bg_freepik-removebg-preview.png"
import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className={classes.hero}>
            <div className={classes.hookContainer}>
                <div className={classes.leftContainer}>
                    <div className={classes.titleContainer}>
                        <h1 className={classes.title}>Where Every Meal Feels Like Home</h1>
                        <p className={classes.hookText}>Experience comfort food with a twist, crafted with love and served with warmth.</p>
                    </div>
                    <Link to="/menu"><button className={classes.orderBtn}>Order Now</button></Link>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.imageContainer}>
                        <img src={burgerImage} alt="" srcSet="" className={classes.image} />
                        <div className={classes.orangeCircle}></div>
                        <div className={classes.redCircle}></div>
                    </div>
                </div>
            </div>
            <a href="#foodMenuShowcase">
                <div className={classes.arrowContainer}>
                    <FaArrowDown />
                </div>
            </a>
        </section>
    )
}

export default Hero; 