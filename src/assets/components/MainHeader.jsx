import { useState } from "react";
import classes from "./MainHeader.module.css";
import { Link } from "react-router-dom";
import Tables from "./Tables";
import tableData from "../tableData.json";
import { IoMenu } from "react-icons/io5";

function MainHeader() {
  const [ isTableVisible, setTableVisibility ] = useState(false);
  const [ isMobileNavVisible, setMobileNavVisibility ] = useState(false);

  const handleTablesView = () => {
    if (!isTableVisible) {
      setTableVisibility(true)
    } else {
      setTableVisibility(false)
    }
  }

  const handleMobileNavView = () => {
    if (!isMobileNavVisible) {
      setMobileNavVisibility(true)
    } else {
      setMobileNavVisibility(false)
    }
  }

  return (
    <section className={classes.headerSection}>
      <Link to="/"><div className={classes.logo}>Food</div></Link>
      <ul className={classes.navlinks}>
        <li className={classes.link} onClick={handleTablesView}>Tabels</li>
        <Link to="/orders"><li className={classes.link}>Orders</li></Link>
        <Link to="/contact"><li className={classes.link}>Contact</li></Link>
        <Link to="/about"><li className={classes.link}>About</li></Link>
        <Link to="/signup"><li className={classes.link}>Sign Up</li></Link>
        <Link to="/menu"><li className={`${classes.link} ${classes.menuLink}`}>Menu</li></Link>
      </ul>
      <IoMenu className={classes.burgerMenu} onClick={handleMobileNavView} />
      { isMobileNavVisible ? <div className={classes.backdrop} onClick={handleMobileNavView}>
        <ul className={classes.hiddenNavlinks}>
          <li className={classes.link} onClick={handleTablesView}>Tabels</li>
          <Link to="/orders"><li className={classes.link}>Orders</li></Link>
          <Link to="/contact"><li className={classes.link}>Contact</li></Link>
          <Link to="/about"><li className={classes.link}>About</li></Link>
          <Link to="/signup"><li className={classes.link}>Sign Up</li></Link>
          <Link to="/menu"><li className={`${classes.link} ${classes.menuLink}`}>Menu</li></Link>
        </ul>
      </div> : null }
      { isTableVisible ? <Tables items={tableData} onCloseBackdrop={handleTablesView} /> : null }
    </section>
  );
}

export default MainHeader;
