// updated OrderStatus.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./OrderStatus.module.css";
import Backdrop from "./Backdrop";
import { FaWindowClose } from "react-icons/fa";
import MessageModal from "./MessageModal";

function OrderStatus() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [tooltipOrderId, setTooltipOrderId] = useState(null);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tableNumber, setTableNumber] = useState();
  const [arrivalStatus, setArrivalStatus] = useState(null); // true = success, false = error
  const [arrivalMessage, setArrivalMessage] = useState(""); // to hold the message

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "active")
      return ["ready", "pending", "processing"].includes(
        order.status.toLowerCase()
      );
    return ["completed", "canceled"].includes(order.status.toLowerCase());
  });

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteWarning(true);
  };

  const handleUpdateClick = (order) => {
    const formattedOrder = {
      id: order.id,
      customer_id: order.customer_id || null,
      table_id: order.table_id || null,
      customer_ip: order.customer_ip || null,
      order_date_time: order.date,
      order_type: "dine-in", // Assuming dine-in for now
      total_price: order.total,
      order_status: order.status,
      payment_status: "pending", // Assuming pending for now
      tx_ref: null,
      arrived: order.arrived,
      customer_temp_id: null,
      is_remote: false,
      notified_arrival: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_items: order.items.map((item) => ({
        id: item.id || null,
        menu_item_id: item.menu_item_id || null,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
        menu_item: {
          id: item.id || null,
          name: item.name,
          description: item.description || "",
          image: item.image,
          price: item.price,
          category_id: null,
          nutritional_info: null,
        },
      })),
    };

    localStorage.setItem(`order_${order.id}`, JSON.stringify(formattedOrder));
    navigate(`${order.id}`);
  };

  const handleArrivalClick = async (order) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${order.id}/notify-arrival`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            table_number: tableNumber,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to notify arrival:", result);
        setArrivalStatus(false);
        setArrivalMessage(result?.error || "Failed to notify arrival");
      } else {
        console.log("Arrival notified:", result);
        setArrivalStatus(true);
        setArrivalMessage(
          <>
            Arrival successfully notified!
            <br />
            Check the order status and once it is "Ready" you can go take it at
            one of the windows!
          </>
        );

        // Instantly reflect change in UI
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, arrived: true } : o))
        );
      }
    } catch (error) {
      console.error("Error notifying arrival:", error);
      setArrivalStatus(false);
      setArrivalMessage("Unexpected error occurred. Please try again.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderToDelete.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ order_status: "canceled" }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to cancel the order:", result);
        setArrivalStatus(false);
        setArrivalMessage(result?.error || "Failed to cancel the order");
      } else {
        console.log("Order Canceled:", result);
        setArrivalStatus(false);
        setArrivalMessage(
          <>
            Order Canceled Successfully!
            <br />
            You can find it in order history tab!
          </>
        );
        setArrivalStatus(true);

        await fetchOrders();
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      setArrivalMessage("Unexpected error occurred. Please try again.");
      setArrivalStatus(false);
    }

    setShowDeleteWarning(false);
  };

  const handleTooltip = (e, order) => {
    if (order.status.toLowerCase() !== "pending") {
      const tooltipMessage =
        order.status.toLowerCase() === "ready"
          ? "Once an order is ready it is impossible to cancel it!"
          : "Once an order is Processing it is impossible to cancel and update it";

      setTooltipText(tooltipMessage);
      setTooltipOrderId(order.id);
      setTooltipPosition({
        x: e.currentTarget.getBoundingClientRect().left,
        y: e.currentTarget.getBoundingClientRect().top,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipOrderId(null);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/user?customer_ip=${localStorage.getItem(
          "customer_ip"
        )}&customer_temp_id=${localStorage.getItem("customer_generated_id")}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      const mappedOrders = data.orders.map((order) => ({
        id: order.id,
        date: new Date(order.order_date_time).toLocaleString(),
        status: order.order_status,
        arrived: !!order.arrived,
        total: parseFloat(order.total_price),
        is_remote: order.order_type === "remote",
        items: order.order_items.map((item) => ({
          id: item.id,
          name: item.menu_item.name,
          price: parseFloat(item.menu_item.price),
          quantity: item.quantity,
          image: `http://127.0.0.1:8000/storage/${item.menu_item.image}`,
        })),
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className={classes.orderStatus}>
      <div className={classes.tabs}>
        <button
          className={`${classes.tabButton} ${
            activeTab === "active" ? classes.activeTab : ""
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Orders
        </button>
        <button
          className={`${classes.tabButton} ${
            activeTab === "history" ? classes.activeTab : ""
          }`}
          onClick={() => setActiveTab("history")}
        >
          Order History
        </button>
      </div>

      <div className={classes.ordersContainer}>
        {filteredOrders.map((order) => (
          <div key={order.id} className={classes.orderCard}>
            <div className={classes.orderHeader}>
              <div className={classes.orderInfo}>
                <h3>Order #{order.id}</h3>
                <p>{order.date}</p>
              </div>
              <div className={classes.orderStatusOnCard}>
                <span
                  className={`${classes.statusBadge} ${
                    classes[order.status.toLowerCase()]
                  }`}
                >
                  {order.status}
                </span>
                {activeTab === "active" &&
                  order.status.toLowerCase() === "pending" && (
                    <button
                      className={classes.cancelButton}
                      onClick={() => handleDeleteClick(order)}
                      onMouseEnter={(e) => handleTooltip(e, order)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <FaWindowClose />
                    </button>
                  )}
              </div>
            </div>

            <div className={classes.orderItems}>
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className={classes.orderItem}>
                  <div
                    className={classes.itemImageContainer}
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <div className={classes.ItemDetailsContainer}>
                    <div className={classes.itemDetails}>
                      <h4>{item.name}</h4>
                    </div>
                    <div className={classes.itemQuantity}>
                      <p>{item.price} ETB</p>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={classes.orderFooter}>
              <div className={classes.orderTotal}>
                <h3>{order.total} ETB</h3>
              </div>
              <div className={classes.orderActions}>
                {activeTab === "active" &&
                  order.status.toLowerCase() === "pending" && (
                    <>
                      {order.is_remote && !order.arrived && (
                        <div className={classes.remoteOrderActions}>
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
                                } else {
                                  setTableNumber(null);
                                }
                              }}
                            />
                          </div>
                          <button
                            className={`${classes.actionButton} ${classes.arrivedButton}`}
                            onClick={() => handleArrivalClick(order)}
                            disabled={order.arrived || !tableNumber}
                          >
                            Arrived
                          </button>
                        </div>
                      )}
                      <button
                        className={`${classes.actionButton} ${classes.updateButton}`}
                        onClick={() => handleUpdateClick(order)}
                      >
                        Update
                      </button>
                    </>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDeleteWarning && (
        <Backdrop onCloseBackdrop={() => setShowDeleteWarning(false)}>
          <div className={classes.warningModal}>
            <h2>Warning</h2>
            <p>
              Are you sure you want to <strong>cancel</strong> the order? If you
              have paid for the order the money will be refunded and feel free
              to order again!
            </p>
            <div className={classes.modalActions}>
              <button
                className={classes.deleteButton}
                onClick={() => setShowDeleteWarning(false)}
              >
                Don't Cancel
              </button>
              <button
                className={classes.deleteButton}
                onClick={handleDeleteConfirm}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </Backdrop>
      )}

      {tooltipOrderId && (
        <div
          className={classes.tooltip}
          style={{
            top: `${tooltipPosition.y - 40}px`,
            left: `${tooltipPosition.x - 100}px`,
          }}
        >
          {tooltipText}
        </div>
      )}

      {arrivalStatus !== null && (
        <MessageModal
          isItError={!arrivalStatus}
          message={arrivalMessage}
          closeMessageBackdrop={() => {
            setArrivalStatus(null);
            setArrivalMessage("");
          }}
        />
      )}
    </div>
  );
}

export default OrderStatus;
