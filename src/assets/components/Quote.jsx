import classes from "./Quote.module.css"
import burger from "../images/bur_ill-removebg-preview.png"

function Quote() {
    return (
        <section className={classes.quoteSection}>
            <div className={classes.leftSide}>
                <p className={classes.leftText}>"One cannot think well, love well, sleep well, if one has not dined well."<br /><br /><span>- Virginia Woolf</span></p>
            </div>
            <div className={classes.rightSide}>
                <div className={classes.rightImageContainer}>
                    <img src={burger} alt="A burger image" srcSet="" />
                </div>
            </div>
        </section>
    )
}

export default Quote;