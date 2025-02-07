import classes from "./MainMenu.module.css"
import MenuSearch from "./MenuSearch";

function MainMenu() {
    return (
        <section className={classes.mainMenu}>
            <MenuSearch />
        </section>
    )
}

export default MainMenu;