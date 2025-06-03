import { useState, useEffect, useContext } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import classes from "./UserProfile.module.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const UserProfile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("auth_token"); // Adjust based on your auth storage

      if (!authToken) {
        setError(t("userProfile.error") || "You are not logged in");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(t("userProfile.error") || "Failed to fetch profile");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(t("userProfile.error") || "Failed to load profile data");
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (passwordError) setPasswordError("");
    if (passwordSuccess) setPasswordSuccess("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.current_password || !passwordData.new_password) {
      setPasswordError(
        t("userProfile.passwordError.required") ||
          "Both current and new passwords are required"
      );
      return;
    }

    if (passwordData.new_password.length < 6) {
      setPasswordError(
        t("userProfile.passwordError.minLength") ||
          "New password must be at least 6 characters long"
      );
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError("");
      const authToken = localStorage.getItem("auth_token");

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/profile/change-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(passwordData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            t("userProfile.error") ||
            "Failed to change password"
        );
      }

      setPasswordSuccess(
        t("userProfile.passwordChanged") || "Password changed successfully!"
      );
      setTimeout(() => {
        setPasswordData({ current_password: "", new_password: "" });
        setPasswordSuccess("");
        setShowPasswordForm(false);
      }, 2000);
    } catch (err) {
      setPasswordError(
        err.message || t("userProfile.error") || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("userProfile.notSet") || "Not Set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVerificationStatus = (isVerified, emailVerifiedAt) => {
    if (isVerified && emailVerifiedAt) return t("userProfile.verified");
    if (isVerified) return t("userProfile.verified");
    return t("userProfile.notVerified");
  };

  // Generate DiceBear avatar URL
  const avatarUrl = user
    ? `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(
        user.name || user.email
      )}`
    : null;

  const handleForgetPassword = () => {
    localStorage.setItem("email_to_reset", user.email);
    navigate("/forget-password");
  };

  const handleVerifyEmail = () => {
    localStorage.setItem("email_to_verify", user.email);
    navigate("/verify-email");
  };

  if (loading) {
    return (
      <div className={classes.container}>
        <div className={classes.loading}>
          <div className={classes.spinner}></div>
          <p>{t("userProfile.loadingProfile")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.container}>
        <div className={classes.error}>
          <p>{error}</p>
          <button onClick={fetchUserProfile} className={classes.retryButton}>
            {t("userProfile.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.profileCard}>
        <div className={classes.header}>
          <img src={avatarUrl} alt="Profile" className={classes.avatar} />
          <h1>{t("userProfile.header")}</h1>
        </div>

        <div className={classes.profileInfo}>
          <div className={classes.infoGrid}>
            <div className={classes.infoItem}>
              <label>{t("userProfile.name")}</label>
              <span>{user.name}</span>
            </div>

            <div className={classes.infoItem}>
              <label>{t("userProfile.email")}</label>
              <span>{user.email}</span>
            </div>

            <div className={classes.infoItem}>
              <label>{t("userProfile.role")}</label>
              <span className={classes.role}>{user.role}</span>
            </div>

            <div className={classes.infoItem}>
              <label>{t("userProfile.verificationStatus")}</label>
              <span
                className={`${classes.status} ${
                  user.is_verified ? classes.verified : classes.unverified
                }`}
              >
                {getVerificationStatus(
                  user.is_verified,
                  user.email_verified_at
                )}
                {!user.is_verified ? (
                  <button
                    onClick={handleVerifyEmail}
                    className={classes.verifyButton}
                  >
                    {t("userProfile.verifyEmail")}
                  </button>
                ) : (
                  ""
                )}
              </span>
            </div>

            <div className={classes.infoItem}>
              <label>{t("userProfile.accountCreated")}</label>
              <span>{formatDate(user.created_at)}</span>
            </div>

            <div className={classes.infoItem}>
              <label>{t("userProfile.lastUpdated")}</label>
              <span>{formatDate(user.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className={classes.actions}>
          {!showPasswordForm ? (
            <div className={classes.bottomContainer}>
              <button
                onClick={() => setShowPasswordForm(true)}
                className={classes.changePasswordButton}
              >
                <FaLock className={classes.lockIcon} />{" "}
                {t("userProfile.changePassword")}
              </button>
              <p
                className={classes.forgetPassword}
                onClick={handleForgetPassword}
              >
                {t("userProfile.forgotPassword")}
              </p>
            </div>
          ) : (
            <div className={classes.passwordForm}>
              <div className={classes.formHeader}>
                <h3>
                  <FaLock /> {t("userProfile.changePassword")}
                </h3>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ current_password: "", new_password: "" });
                    setPasswordError("");
                    setPasswordSuccess("");
                  }}
                  className={classes.closeButton}
                >
                  <FaTimes />
                </button>
              </div>

              {passwordError && (
                <div className={classes.errorMessage}>{passwordError}</div>
              )}

              {passwordSuccess && (
                <div className={classes.successMessage}>{passwordSuccess}</div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <div className={classes.inputGroup}>
                  <label htmlFor="current_password">{t("userProfile.currentPassword")}</label>
                  <div className={classes.passwordInput}>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="current_password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      required
                      placeholder={t("userProfile.passwordPlaceholder")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className={classes.eyeButton}
                    >
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className={classes.inputGroup}>
                  <label htmlFor="new_password">{t("userProfile.newPassword")}</label>
                  <div className={classes.passwordInput}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="new_password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      required
                      placeholder={t("userProfile.passwordPlaceholder")}
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={classes.eyeButton}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className={classes.formActions}>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className={classes.saveButton}
                  >
                    {passwordLoading ? (
                      <>
                        <div className={classes.buttonSpinner}></div>
                        {t("userProfile.saving")}
                      </>
                    ) : (
                      <>
                        <FaSave /> {t("userProfile.savePassword")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
