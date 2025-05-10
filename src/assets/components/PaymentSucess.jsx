import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import classes from "./PaymentSuccess.module.css";
import {
  FaLock,
  FaCreditCard,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMoneyBill,
} from "react-icons/fa";

function PaymentSuccess() {
  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  const [tip, setTip] = useState();
  const [loading, setLoading] = useState(false);
  const [orderPrice, setOrderPrice] = useState(null); // State to store the order price
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const { totalPrice, orderId } = useParams();
  const [updatedPrice, setUpdatedPrice] = useState(totalPrice);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const message = params.get("message");
    if (status && message) {
      setPaymentStatus({ status, message });
    }
  }, [location]);

  useEffect(() => {
    // Fetch the order details using the orderId
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/orders/${orderId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("auth_token"),
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.order) {
          setOrderPrice(parseFloat(data.order.total_price)); // Set the order price
        } else {
          console.error("Failed to fetch order details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!totalPrice) {
      alert("Total price is missing.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/payment/chapa/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("auth_token"),
          },
          body: JSON.stringify({
            amount: parseFloat(updatedPrice),
            ...customerInfo,
            order_id: orderId,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success" && data.checkout_url) {
        localStorage.setItem("chapa_tx_ref", data.tx_ref);
        window.location.href = data.checkout_url;
      } else {
        alert("Payment initialization failed.");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("An error occurred while initiating payment.");
    } finally {
      setLoading(false); // Set loading to false when processing ends
    }
  };

  useEffect(() => {
    // Check if the updated price is less than the order price
    if (orderPrice !== null && totalPrice < orderPrice) {
      setErrorMessage(
        "You are paying less than the order price! Go to the orders page and use the pay button to pay the actual amount, please!"
      );
    } else {
      setErrorMessage(""); // Clear the error message if the condition is met
    }
  }, [totalPrice, orderPrice]);

  if (paymentStatus) {
    return (
      <div className={classes.container}>
        <div className={`${classes.message} ${classes[paymentStatus.status]}`}>
          <h2>
            {paymentStatus.status === "success"
              ? "Payment Successful!"
              : "Payment Failed"}
          </h2>
          <p>{paymentStatus.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.paymentForm}>
        {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
        <div className={classes.header}>
          <FaLock className={classes.lockIcon} />
          <h2>Secure Payment</h2>
          <p className={classes.subtitle}>
            Complete your payment to finalize your order
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={classes.formGroup}>
            <label htmlFor="email">
              <FaEnvelope className={classes.inputIcon} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="first_name">
              <FaUser className={classes.inputIcon} />
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={customerInfo.first_name}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="last_name">
              <FaUser className={classes.inputIcon} />
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={customerInfo.last_name}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="phone_number">
              <FaPhone className={classes.inputIcon} />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={customerInfo.phone_number}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="tip">
              <FaMoneyBill className={classes.inputIcon} />
              Tip
            </label>
            <input
              type="number"
              id="tip"
              name="tip"
              value={tip} // Remove default 0
              onChange={(e) => {
                const tipValue = e.target.value;
                setTip(tipValue === "0" ? "" : tipValue); // Remove 0 when typing starts
                setUpdatedPrice(parseFloat(totalPrice) + Number(tipValue || 0)); // Update the total price
              }}
              placeholder="Send your appreciation to the chefs"
            />
          </div>

          <div className={classes.paymentSummary}>
            <h3>Payment Summary</h3>
            <div className={classes.summaryRow}>
              <span>Price + Tip</span>
              <span className={classes.amount}>
                {parseFloat(totalPrice).toFixed(2)} + {tip ? tip : 0} ETB
              </span>
            </div>
            <div className={classes.summaryRow}>
              <span>Total Amount:</span>
              <span className={classes.amount}>
                {parseFloat(updatedPrice).toFixed(2)} ETB
              </span>
            </div>
          </div>

          <button type="submit" className={classes.button} disabled={loading || totalPrice < orderPrice}>
            {loading ? (
              "Processing..."
            ) : (
              <>
                <FaCreditCard className={classes.buttonIcon} />
                Proceed to Payment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentSuccess;
