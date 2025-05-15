import React, { useState } from "react";
import classes from "./Feedback.module.css";
import MessageModal from "./MessageModal";

function Feedback() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState(null); // Success or error state
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Message to display in the modal

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setFeedbackStatus(false);
      setFeedbackMessage("Message cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const authToken = localStorage.getItem("auth_token");
      const url = authToken
        ? "http://127.0.0.1:8000/api/feedbacks/logged-in"
        : "http://127.0.0.1:8000/api/feedbacks/guest";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send feedback. Please try again.");
      }

      setFeedbackStatus(true);
      setFeedbackMessage(
        "Thank you for your feedback! It has been sent successfully."
      );
      setMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending feedback:", error);
      setFeedbackStatus(false);
      setFeedbackMessage(
        "An error occurred while sending your feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={classes.feedbackSection}>
      <h1 className={classes.header}>Send Us Your Feedback</h1>
      <p className={classes.description}>
        Your feedback is valuable to us. Please share your thoughts with our
        admins.
      </p>
      <form onSubmit={handleSubmit} className={classes.feedbackForm}>
        <textarea
          className={classes.textarea}
          placeholder="Write your feedback here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="5"
        //   required
        />
        <button
          type="submit"
          className={classes.submitButton}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Feedback"}
        </button>
      </form>

      {feedbackStatus !== null && (
        <MessageModal
          isItError={!feedbackStatus}
          message={feedbackMessage}
          closeMessageBackdrop={() => setFeedbackStatus(null)}
        />
      )}
    </section>
  );
}

export default Feedback;
