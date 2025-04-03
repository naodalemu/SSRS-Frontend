import React, { useEffect, useState } from "react";
import classes from "./UpdateOrder.module.css";
import { FaWindowClose } from "react-icons/fa";
import MessageModal from "./MessageModal";
import { useLocation } from "react-router-dom";
import MenuSearch from "./MenuSearch";

function UpdateOrder() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tableNumber, setTableNumber] = useState(null);
  const [isValidTableNumber, setIsValidTableNumber] = useState(false);
  const [isError, setIsError] = useState(null);
  const location = useLocation();
  const orderData = location.state?.orderData;

  useEffect(() => {
    // Extract the last part of the URL and check if it's a valid number
    const pathParts = location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    const tableNum = parseInt(lastPart, 10);

    if (!isNaN(tableNum)) {
      setTableNumber(tableNum);
      setIsValidTableNumber(true);
      localStorage.setItem("tableNumber", tableNum);
    } else {
      setTableNumber(null);
      setIsValidTableNumber(false);
      localStorage.removeItem("tableNumber");
    }

    // Retrieve cart from local storage
    if (orderData) {
      setCart(orderData.items);
      updateTotalPrice(orderData.items);
    } else {
      // Fallback: retrieve cart from local storage if no orderData is passed
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
      updateTotalPrice(storedCart);
    }

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
  }, [location.pathname, orderData]);

  const updateTotalPrice = (cart) => {
    const total = cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
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
      table_number: tableNum, // Ensure tableNumber is valid
      order_items: cart.map((item) => ({
        menu_item_id: item.id, // map `id` to `menu_item_id`
        quantity: item.quantity,
      })),
      customer_ip: customerIp, // Send customer IP
      customer_generated_id: customerGeneratedId, // Send generated ID
    };

    // Send the cart data and table number to the backend
    fetch("http://127.0.0.1:8000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
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

  return (
    <section>
      <div className={classes.cartSummary} onClick={(e) => e.stopPropagation()}>
        <h3 className={classes.cartHeader}>Order #{orderData?.id}</h3>
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
                  <span className={classes.priceValue}>${item.price}</span>
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
          <p className={classes.totalPrice}>Total: ${totalPrice.toFixed(2)}</p>
          <button
            onClick={handleOrder}
            className={classes.orderButton}
            disabled={!isValidTableNumber || cart.length === 0} // Disable button if no valid table number or cart is empty
          >
            Update
          </button>
        </div>
      </div>

      <MenuSearch />
    </section>
  );
}

export default UpdateOrder;
