import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classes from "./UpdateOrder.module.css";
import { FaWindowClose } from "react-icons/fa";
import MessageModal from "./MessageModal";
import { useLocation } from "react-router-dom";
import MenuSearch from "./MenuSearch";

function UpdateOrder() {
  const { orderId } = useParams();
  const storedOrder = localStorage.getItem(`order_${orderId}`);
  const initialOrder = storedOrder ? JSON.parse(storedOrder) : { items: [] };
  const [cart, setCart] = useState(initialOrder.items || []);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tableNumber, setTableNumber] = useState(null);
  const [isValidTableNumber, setIsValidTableNumber] = useState(false);
  const [isError, setIsError] = useState(null);
  const location = useLocation();
  const orderData = location.state?.orderData;

  useEffect(() => {
    const storedOrder = localStorage.getItem(`order_${orderId}`);
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      setCart(parsedOrder.order_items || []); // Use `order_items` from the stored order
      updateTotalPrice(parsedOrder.order_items || []);
      setTableNumber(parsedOrder.table_id || null);
      setIsValidTableNumber(!!parsedOrder.table_id);
    } else {
      setCart([]);
      updateTotalPrice([]);
      setTableNumber(null);
      setIsValidTableNumber(false);
    }

    // Generate random customer ID if not already set
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
  }, [orderId]);

  const updateTotalPrice = (cart) => {
    const total = cart.reduce((acc, item) => {
      return acc + item.total_price;
    }, 0);
    setTotalPrice(total);
  };

  const handleAmountChange = (index, delta) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += delta;
    updatedCart[index].total_price =
      updatedCart[index].menu_item.price * updatedCart[index].quantity;

    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1); // Remove the item if quantity <= 0
    }

    setCart(updatedCart);

    const updatedOrder = {
      ...JSON.parse(localStorage.getItem(`order_${orderId}`)),
      order_items: updatedCart,
    };
    localStorage.setItem(`order_${orderId}`, JSON.stringify(updatedOrder));
    updateTotalPrice(updatedCart);
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);

    setCart(updatedCart);

    const updatedOrder = {
      ...JSON.parse(localStorage.getItem(`order_${orderId}`)),
      order_items: updatedCart,
    };
    localStorage.setItem(`order_${orderId}`, JSON.stringify(updatedOrder));
    updateTotalPrice(updatedCart);
  };

  const handleOrder = async () => {
    const payload = {
      table_number: tableNumber,
      order_items: cart.map((item) => ({
        menu_item_id: item.menu_item.id,
        quantity: item.quantity,
      })),
      customer_ip: localStorage.getItem("customer_ip"),
      customer_generated_id: localStorage.getItem("customer_generated_id"),
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // Include auth token if required
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Validation Error:", data);
        setIsError(true);
      } else {
        console.log("Order updated:", data);
        localStorage.removeItem(`order_${orderId}`);
        setCart([]);
        setTotalPrice(0);
        setIsError(false);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      setIsError(true);
    }
  };

  const handleAddItem = (menuItem) => {
    const updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex(
      (item) => item.menu_item.id === menuItem.id
    );

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity += 1;
      updatedCart[existingIndex].total_price =
        updatedCart[existingIndex].menu_item.price *
        updatedCart[existingIndex].quantity;
    } else {
      updatedCart.push({
        menu_item: menuItem,
        quantity: 1,
        total_price: menuItem.price,
      });
    }

    setCart(updatedCart);

    const updatedOrder = {
      ...JSON.parse(localStorage.getItem(`order_${orderId}`)),
      order_items: updatedCart,
    };
    localStorage.setItem(`order_${orderId}`, JSON.stringify(updatedOrder));
    updateTotalPrice(updatedCart);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/orders/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // Include auth token if required
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setCart(data.order_items || []); // Use `order_items` from the API response
        updateTotalPrice(data.order_items || []);
        setTableNumber(data.table_id || null);
        setIsValidTableNumber(!!data.table_id);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

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
                  <span className={classes.itemName}>
                    {" "}
                    {item.menu_item.name}{" "}
                  </span>
                  x{" "}
                  <span className={classes.priceValue}>
                    ${item.menu_item.price.toFixed(2)}
                  </span>
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

      <MenuSearch onAddItem={handleAddItem} />
    </section>
  );
}

export default UpdateOrder;
