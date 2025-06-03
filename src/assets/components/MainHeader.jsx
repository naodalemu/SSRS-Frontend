import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import classes from "./MainHeader.module.css";
import { Link, useNavigate } from "react-router-dom";
import Tables from "./Tables";
import tableData from "../tableData.json";
import { IoMenu } from "react-icons/io5";
import MessageModal from "./MessageModal";
import { FiLogOut } from "react-icons/fi";
import { FaGlobe } from "react-icons/fa";
import { FaLanguage } from "react-icons/fa6";

function MainHeader() {
  const [isTableVisible, setTableVisibility] = useState(false);
  const [isMobileNavVisible, setMobileNavVisibility] = useState(false);
  const [isLanguageDropdownVisible, setLanguageDropdownVisibility] =
    useState(false);
  const { isLoggedIn, userDetails, logout, message, isError, setMessage } =
    useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Retrieve the language from localStorage on page load
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleTablesView = () => {
    setTableVisibility((prev) => !prev);
  };

  const handleMobileNavView = () => {
    setMobileNavVisibility((prev) => !prev);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("selectedLanguage", lang);
    setLanguageDropdownVisibility(false); // Close dropdown after selection
  };

  return (
    <section className={classes.headerSection}>
      <Link to="/">
        <div className={classes.logo}>Food</div>
      </Link>
      <ul className={classes.navlinks}>
        <div className={classes.languageSelector}>
          <button
            className={classes.languageButton}
            onClick={() => setLanguageDropdownVisibility((prev) => !prev)}
          >
            <FaLanguage />
          </button>
          {isLanguageDropdownVisible && (
            <ul className={classes.languageDropdown}>
              <li onClick={() => changeLanguage("en")}>English</li>
              <li onClick={() => changeLanguage("am")}>አማርኛ</li>
              <li onClick={() => changeLanguage("om")}>Afaan Oromoo</li>
            </ul>
          )}
        </div>
        <li className={classes.link} onClick={handleTablesView}>
          {t("tables")}
        </li>
        <Link to="/orders">
          <li className={classes.link}>{t("orders")}</li>
        </Link>
        <Link to="/about">
          <li className={classes.link}>{t("about")}</li>
        </Link>
        {isLoggedIn && userDetails ? (
          <li className={classes.link}>
            <Link to="/user-profile">{t("profile")}</Link>
          </li>
        ) : (
          <li className={classes.link} onClick={handleLoginRedirect}>
            {t("login")}
          </li>
        )}
        <Link to="/menu">
          <li className={`${classes.link} ${classes.menuLink}`}>{t("menu")}</li>
        </Link>
        {/* Logout Button */}
        {isLoggedIn && userDetails && (
          <li
            onClick={logout}
            className={`${classes.link} ${classes.logoutLink}`}
          >
            <FiLogOut size={20} />
          </li>
        )}
      </ul>
      <IoMenu className={classes.burgerMenu} onClick={handleMobileNavView} />
      {isMobileNavVisible ? (
        <div className={classes.backdrop} onClick={handleMobileNavView}>
          <ul className={classes.hiddenNavlinks}>
            <li className={classes.link} onClick={handleTablesView}>
              {t("tables")}
            </li>
            <Link to="/orders">
              <li className={classes.link}>{t("orders")}</li>
            </Link>
            <Link to="/about">
              <li className={classes.link}>{t("about")}</li>
            </Link>
            {isLoggedIn && userDetails ? (
              <>
                <li className={classes.link} onClick={logout}>
                  Log Out
                </li>
                <li className={classes.link}>
                  <Link to="/user-profile">{t("profile")}</Link>
                </li>
              </>
            ) : (
              <li className={classes.link} onClick={handleLoginRedirect}>
                {t("login")}
              </li>
            )}
            <Link to="/menu">
              <li className={`${classes.link} ${classes.menuLink}`}>
                {t("menu")}
              </li>
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
