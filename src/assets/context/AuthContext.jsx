import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("auth_token")
  );
  const [userDetails, setUserDetails] = useState(null);
  const [message, setMessage] = useState(""); // State for informational messages
  const [isError, setIsError] = useState(false); // State to determine if the message is an error

  // Fetch user details if logged in
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/user/profile`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user details");
          }

          const data = await response.json();
          setUserDetails(data);
        } catch (error) {
          console.error("Error fetching user details:", error);
          setIsLoggedIn(false);
          localStorage.removeItem("auth_token");
        }
      }
    };

    fetchUserDetails();
  }, [isLoggedIn]);

  const login = (token) => {
    localStorage.setItem("auth_token", token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      localStorage.removeItem("auth_token");
      localStorage.removeItem("email_to_reset")
      localStorage.removeItem("email_to_verify")

      setIsLoggedIn(false);
      setUserDetails(null);

      setMessage("Successfully logged out!");
      setIsError(false);
    } catch (error) {
      console.error("Logout failed:", error.message);
      setMessage("Failed to log out. Please try again.");
      setIsError(true);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userDetails, login, logout, message, setMessage, isError }}>
      {children}
    </AuthContext.Provider>
  );
};
