import classes from "./Contact.module.css"
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaMedium } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa6";
import cafeMap from "../images/london_cafe_map.png"
import { useTranslation } from "react-i18next";

function Contact() {
    const { t } = useTranslation();

    return (
        <section className={classes.contactSection} id="contactSection">
            <div className={classes.mapContainer} style={{ backgroundImage: `url(${cafeMap})` }} />
            <div className={classes.textContact}>
                <p className={classes.hint}>{t("contactPage.hint")}</p>
                <p className={classes.header}>{t("contactPage.header")}</p>
                <p className={classes.sectionDescription}>{t("contactPage.description")}</p>
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