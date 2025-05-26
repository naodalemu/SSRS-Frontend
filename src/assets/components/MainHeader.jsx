import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import classes from "./MainHeader.module.css";
import { Link, useNavigate } from "react-router-dom";
import Tables from "./Tables";
import tableData from "../tableData.json";
import { IoMenu } from "react-icons/io5";
import MessageModal from "./MessageModal";

function MainHeader() {
  const [isTableVisible, setTableVisibility] = useState(false);
  const [isMobileNavVisible, setMobileNavVisibility] = useState(false);
  const { isLoggedIn, userDetails, logout, message, isError, setMessage } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleTablesView = () => {
    setTableVisibility((prev) => !prev);
  };

  const handleMobileNavView = () => {
    setMobileNavVisibility((prev) => !prev);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <section className={classes.headerSection}>
      <Link to="/">
        <div className={classes.logo}>Food</div>
      </Link>
      <ul className={classes.navlinks}>
        <li className={classes.link} onClick={handleTablesView}>
          Tables
        </li>
        <Link to="/orders">
          <li className={classes.link}>Orders</li>
        </Link>
        <Link to="/about">
          <li className={classes.link}>About</li>
        </Link>
        {isLoggedIn && userDetails ? (
          <>
            <li className={classes.link} onClick={logout}>
              Log Out
            </li>
            <li className={classes.link}>
              <Link to="/user-profile">Profile</Link>
            </li>
          </>
        ) : (
          <li className={classes.link} onClick={handleLoginRedirect}>
            Log In
          </li>
        )}
        <Link to="/menu">
          <li className={`${classes.link} ${classes.menuLink}`}>Menu</li>
        </Link>
      </ul>
      <IoMenu className={classes.burgerMenu} onClick={handleMobileNavView} />
      {isMobileNavVisible ? (
        <div className={classes.backdrop} onClick={handleMobileNavView}>
          <ul className={classes.hiddenNavlinks}>
            <li className={classes.link} onClick={handleTablesView}>
              Tables
            </li>
            <Link to="/orders">
              <li className={classes.link}>Orders</li>
            </Link>
            <Link to="/about">
              <li className={classes.link}>About</li>
            </Link>
            {isLoggedIn && userDetails ? (
              <>
                <li className={classes.link} onClick={logout}>
                  Log Out
                </li>
                <li className={classes.link}>
                  <Link to="/user-profile">Profile</Link>
                </li>
              </>
            ) : (
              <li className={classes.link} onClick={handleLoginRedirect}>
                Log In
              </li>
            )}
            <Link to="/menu">
              <li className={`${classes.link} ${classes.menuLink}`}>Menu</li>
            </Link>
          </ul>
        </div>
      ) : null}
      {isTableVisible ? (
        <Tables items={tableData} onCloseBackdrop={handleTablesView} />
      ) : null}

      {/* Message Modal */}
      {message && (
        <MessageModal
          isItError={isError}
          message={message}
          closeMessageBackdrop={() => setMessage("")}
        />
      )}
    </section>
  );
}

export default MainHeader;
