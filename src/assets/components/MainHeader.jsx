import { useState } from "react";
import classes from "./MainHeader.module.css";
import { Link, useNavigate } from "react-router-dom";
import Tables from "./Tables";
import tableData from "../tableData.json";
import { IoMenu } from "react-icons/io5";
import MessageModal from "./MessageModal"; // Import the MessageModal component

function MainHeader() {
  const [isTableVisible, setTableVisibility] = useState(false);
  const [isMobileNavVisible, setMobileNavVisibility] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("auth_token"));
  const [message, setMessage] = useState(""); // State for informational messages
  const [isError, setIsError] = useState(false); // State to determine if the message is an error
  const navigate = useNavigate();

  const handleTablesView = () => {
    setTableVisibility((prev) => !prev);
  };

  const handleMobileNavView = () => {
    setMobileNavVisibility((prev) => !prev);
  };

  const handleLogout = async () => {
    // Check if the user is already logged out
    if (!localStorage.getItem("auth_token")) {
      setIsError(true);
      setMessage("You are already logged out.");
      return;
    }

    try {
      // Call the logout API
      const response = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      // Clear the auth_token from localStorage
      localStorage.removeItem("auth_token");
      setToken(null); // Update the token state

      // Show the logout success message
      setMessage(
        "Successfully logged out, but the orders you make while you are logged out cannot be guaranteed to be preserved in case your IP changes!"
      );
      setIsError(false);
    } catch (error) {
      console.error("Logout failed:", error.message);
      setMessage("Failed to log out. Please try again.");
      setIsError(true);
    }
  };

  const handleLoginRedirect = () => {
    // Check if the user is already logged in
    if (localStorage.getItem("auth_token")) {
      setIsError(true);
      setMessage("You are already signed in. But if you want, this account will be logged out and a new one will be logged in if you login again.");

      // Redirect to the main page after showing the message
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

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
        <Link to="/contact">
          <li className={classes.link}>Contact</li>
        </Link>
        <Link to="/about">
          <li className={classes.link}>About</li>
        </Link>
        <li className={classes.link} onClick={handleLogout}>
          Log Out
        </li>
        <li className={classes.link} onClick={handleLoginRedirect}>
          Log In
        </li>
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
            <Link to="/contact">
              <li className={classes.link}>Contact</li>
            </Link>
            <Link to="/about">
              <li className={classes.link}>About</li>
            </Link>
            <li className={classes.link} onClick={handleLogout}>
              Log Out
            </li>
            <li className={classes.link} onClick={handleLoginRedirect}>
              Log In
            </li>
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