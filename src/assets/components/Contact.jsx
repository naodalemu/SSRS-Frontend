import classes from "./Contact.module.css"
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaMedium } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa6";
import cafeMap from "../images/london_cafe_map.png"

function Contact() {
    return (
        <section className={classes.contactSection} id="contactSection">
            <div className={classes.mapContainer} style={{ backgroundImage: `url(${cafeMap})` }} />
            <div className={classes.textContact}>
                <p className={classes.hint}>WHERE TO FIND US</p>
                <p className={classes.header}>COME HOME</p>
                <p className={classes.sectionDescription}>This is our exact location on the left and use our contact information to contact us from anywhere you want, our customer service will help you settle your curiosity!</p>
                <div className={classes.iconLinks}>
                    <FaFacebook />
                    <FaXTwitter />
                    <FaInstagram />
                    <FaTelegram />
                    <FaMedium />
                </div>
            </div>
        </section>
    )
}

export default Contact;