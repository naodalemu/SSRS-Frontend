import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classes from "./UpdateOrder.module.css";
import { FaWindowClose } from "react-icons/fa";
import MessageModal from "./MessageModal";
import { useNavigate } from "react-router-dom";
import MenuItemSelector from "./MenuItemSelector";

function UpdateOrder() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tableNumber, setTableNumber] = useState(null);
  const [isValidTableNumber, setIsValidTableNumber] = useState(false);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    const fetchAndStoreOrder = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch order");

        const result = await response.json();
        const order = result.order;

        // Structure cart for UI
        const structuredCart = order.order_items.map((item) => ({
          menu_item: item.menu_item,
          quantity: Number(item.quantity),
          total_price: Number(item.total_price),
        }));

        setCart(structuredCart);
        setTotalPrice(
          structuredCart.reduce((acc, i) => acc + i.total_price, 0)
        );
        setTableNumber(order.table_id);
        setIsValidTableNumber(!!order.table_id);

        localStorage.setItem(`order_${orderId}`, JSON.stringify(order));
      } catch (error) {
        console.error("Error loading order:", error);
      }
    };

    fetchAndStoreOrder();

    if (!localStorage.getItem("customer_generated_id")) {
      localStorage.setItem(
        "customer_generated_id",
        `cust_${Math.random().toString(36).substr(2, 9)}`
      );
    }

    if (!localStorage.getItem("customer_ip")) {
      fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then((data) => localStorage.setItem("customer_ip", data.ip))
        .catch((err) => console.error("Failed to fetch IP:", err));
    }
  }, [orderId]);

  const updateLocalStorageCart = (updatedCart) => {
    const stored = JSON.parse(localStorage.getItem(`order_${orderId}`));
    stored.order_items = updatedCart;
    localStorage.setItem(`order_${orderId}`, JSON.stringify(stored));
  };

  const handleAmountChange = (index, delta) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += delta;
    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index].total_price =
        updatedCart[index].menu_item.price * updatedCart[index].quantity;
    }
    setCart(updatedCart);
    updateLocalStorageCart(updatedCart);
    setTotalPrice(updatedCart.reduce((acc, i) => acc + i.total_price, 0));
  };

  const handleRemoveItem = (index) => {
    handleAmountChange(index, -cart[index].quantity);
  };

  const handleAddItem = (menuItem) => {
    const updatedCart = [...cart];
    const existing = updatedCart.find((i) => i.menu_item.id === menuItem.id);
    if (existing) {
      existing.quantity++;
      existing.total_price = existing.menu_item.price * existing.quantity;
    } else {
      updatedCart.push({
        menu_item: menuItem,
        quantity: 1,
        total_price: menuItem.price,
      });
    }
    setCart(updatedCart);
    updateLocalStorageCart(updatedCart);
    setTotalPrice(updatedCart.reduce((acc, i) => acc + i.total_price, 0));
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
        `${import.meta.env.VITE_BASE_URL}/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setIsError(true);
        console.error("Validation failed:", result);
      } else {
        setIsError(false);
        localStorage.removeItem(`order_${orderId}`);
        console.log("Order updated successfully");
      }
    } catch (err) {
      setIsError(true);
      console.error("Error submitting order:", err);
    }

    setTimeout(() => {
      navigate("/orders");
    }, 1000);
  };

  return (
    <section>
      <div className={classes.cartSummary} onClick={(e) => e.stopPropagation()}>
        <h3 className={classes.cartHeader}>Order #{orderId}</h3>
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
                    {item.menu_item.name}
                  </span>
                  x
                  <span className={classes.priceValue}>
                    {Number(item.menu_item.price).toFixed(2)} ETB
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
          <p className={classes.totalPrice}>
            Total: {totalPrice.toFixed(2)} ETB
          </p>
          <button
            onClick={handleOrder}
            className={classes.orderButton}
            disabled={!isValidTableNumber || cart.length === 0}
          >
            Update
          </button>
        </div>
      </div>
      <MenuItemSelector onAddItem={handleAddItem} />
      {isError !== null && (
        <MessageModal
          isItError={isError}
          message={
            isError
              ? "Something must be wrong from our side, order was not successful! Please try to contact a waiter if you can! Thank you for your patience!"
              : "Order updated successfully!"
          }
          closeMessageBackdrop={() => setIsError(null)}
        />
      )}
    </section>
  );
}

export default UpdateOrder;
