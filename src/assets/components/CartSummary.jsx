import React, { useEffect, useState } from "react";
import classes from "./CartSummary.module.css";
import { FaWindowClose } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import MessageModal from "./MessageModal";
import Backdrop from "./Backdrop";

function CartSummary({ closeBackdrop, successMessage }) {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tableNumber, setTableNumber] = useState(null);
  const [isValidTableNumber, setIsValidTableNumber] = useState(false);
  const [isError, setIsError] = useState(null);
  const location = useLocation();
  const [orderType, setOrderType] = useState("dine-in");
  const [initialTableNumberFromUrl, setInitialTableNumberFromUrl] =
    useState(null);

  useEffect(() => {
    // Extract the last part of the URL and check if it's a valid number
    const pathParts = location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    const urlTableNum = parseInt(lastPart, 10);

    if (!isNaN(urlTableNum)) {
      setInitialTableNumberFromUrl(urlTableNum);
      setTableNumber(urlTableNum);
      setIsValidTableNumber(true);
      localStorage.setItem("tableNumber", urlTableNum);
    } else {
      setTableNumber(null);
      setIsValidTableNumber(false);
      localStorage.removeItem("tableNumber");
    }

    // Retrieve cart from local storage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    updateTotalPrice(storedCart);

    // Generate random customer_generated_id if not already set
    if (!localStorage.getItem("customer_generated_id")) {
      const randomId = `cust_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("customer_generated_id", randomId);
    }

    // Fetch user IP and store it in localStorage
    if (!localStorage.getItem("customer_ip")) {
      fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("customer_ip", data.ip);
        })
        .catch((error) => {
          console.error("Error fetching IP:", error);
        });
    }
  }, [location.pathname]);

  const updateTotalPrice = (cart) => {
    const total = cart.reduce((acc, item) => {
      return acc + parseFloat(item.price.replace("$", "")) * item.quantity;
    }, 0);
    setTotalPrice(total);
  };

  const handleAmountChange = (index, delta) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += delta;

    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1); // Remove the item if amount <= 0
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateTotalPrice(updatedCart);
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateTotalPrice(updatedCart);
  };

  const handleOrder = () => {
    const tableNum = localStorage.getItem("tableNumber");
    const customerGeneratedId = localStorage.getItem("customer_generated_id");
    const customerIp = localStorage.getItem("customer_ip");

    const payload = {
      table_number: orderType === "dine-in" ? tableNumber : null,
      order_items: cart.map((item) => ({
        menu_item_id: item.id, // map `id` to `menu_item_id`
        quantity: item.quantity,
        excluded_ingredients: item.excluded_ingredients.length !== 0 ? item.excluded_ingredients : null,
      })),
      customer_ip: customerIp, // Send customer IP
      customer_temp_id: customerGeneratedId, // Send generated ID
      order_type: orderType,
    };

    // Send the cart data and table number to the backend
    fetch("http://127.0.0.1:8000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("auth_token")
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          const errorText = await response.text(); // get raw response
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          const text = await response.text();
          throw new Error(`Unexpected response format: ${text}`);
        }
      })
      .then((data) => {
        if (data.error) {
          console.error("Validation Error:", data);
          setIsError(true);
        } else {
          console.log("Order placed:", data);
          localStorage.removeItem("cart");
          setCart([]);
          setTotalPrice(0);
          setIsError(false);
        }
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        setIsError(true); // Set error to true in case of network failure
      });
  };

  useEffect(() => {
    // Only execute this if isError is not null
    if (isError !== null) {
      successMessage(isError); // Trigger the success/error message
      console.log(isError); // Log the error state for debugging

      const timer = setTimeout(() => {
        closeBackdrop(); // Close the modal after message is displayed
      }, 1);

      // Cleanup timer
      return () => clearTimeout(timer);
    }
  }, [isError, successMessage, closeBackdrop]);

  const getOrderButtonTooltip = () => {
    if (cart.length === 0) {
      return "Add at least one item to your cart before ordering.";
    }
    if (orderType === "dine-in" && (!tableNumber || !isValidTableNumber)) {
      return "Enter your table number for dine-in orders.";
    }
    return "";
  };

  return (
    <Backdrop onCloseBackdrop={closeBackdrop}>
      <div className={classes.cartSummary} onClick={(e) => e.stopPropagation()}>
        <h3 className={classes.cartHeader}>Check Your Orders</h3>
        {cart.length === 0 ? (
          <p className={classes.emptyCartMessage}>
            Please add an item to order.
          </p>
        ) : (
          <ul className={classes.cartList}>
            {cart.map((item, index) => (
              <li key={index} className={classes.cartItem}>
                <div className={classes.itemDetails}>
                  <span className={classes.amountValue}>{item.quantity}</span>
                  <span className={classes.itemName}> {item.name} </span>x{" "}
                  <span className={classes.priceValue}>{item.price} ETB</span>
                </div>
                <div className={classes.orderItemButtonsContainer}>
                  <button
                    className={`${classes.amountButton} ${classes.lowerButton}`}
                    onClick={() => handleAmountChange(index, -1)}
                  >
                    -
                  </button>
                  <span className={classes.amountValue}>{item.quantity}</span>
                  <button
                    className={`${classes.amountButton} ${classes.upperButton}`}
                    onClick={() => handleAmountChange(index, 1)}
                  >
                    +
                  </button>
                  <button
                    className={classes.removeButton}
                    onClick={() => handleRemoveItem(index)}
                  >
                    <FaWindowClose />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className={classes.orderContainer}>
          <p className={classes.totalPrice}>Total: {totalPrice.toFixed(2)} ETB</p>
          <div className={classes.orderControllerButtonsContainer}>
            {orderType === "dine-in" && (
              <div className={classes.tableInputContainer}>
                <input
                  type="number"
                  id="tableNumber"
                  placeholder="Table No"
                  value={tableNumber || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value)) {
                      setTableNumber(value);
                      setIsValidTableNumber(true);
                      localStorage.setItem("tableNumber", value);
                    } else {
                      setTableNumber(null);
                      setIsValidTableNumber(false);
                      localStorage.removeItem("tableNumber");
                    }
                  }}
                />
              </div>
            )}

            <div className={classes.orderOptions}>
              <label>
                <input
                  type="radio"
                  name="orderType"
                  value="dine-in"
                  checked={orderType === "dine-in"}
                  onChange={() => setOrderType("dine-in")}
                />
                Dine-in
              </label>
              <label>
                <input
                  type="radio"
                  name="orderType"
                  value="remote"
                  checked={orderType === "remote"}
                  onChange={() => {
                    setOrderType("remote");
                    setTableNumber(null);
                    setIsValidTableNumber(true); // allow order when remote
                    localStorage.removeItem("tableNumber");
                  }}
                />
                Remote
              </label>
            </div>

            <button
              onClick={handleOrder}
              className={classes.orderButton}
              disabled={
                cart.length === 0 ||
                (orderType === "dine-in" &&
                  (!tableNumber || !isValidTableNumber))
              }
              title={
                cart.length === 0 ||
                (orderType === "dine-in" &&
                  (!tableNumber || !isValidTableNumber))
                  ? getOrderButtonTooltip()
                  : ""
              }
            >
              Order
            </button>
          </div>
        </div>
        <button onClick={closeBackdrop} className={classes.closeButton}>
          <FaWindowClose />
        </button>
      </div>
    </Backdrop>
  );
}

export default CartSummary;
