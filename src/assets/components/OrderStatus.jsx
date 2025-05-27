import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classes from "./OrderStatus.module.css";
import Backdrop from "./Backdrop";
import { FaWindowClose } from "react-icons/fa";
import MessageModal from "./MessageModal";

function OrderStatus() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [tooltipOrderId, setTooltipOrderId] = useState(null);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tableNumber, setTableNumber] = useState();
  const [arrivalStatus, setArrivalStatus] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState("");
  const [ingredientsMap, setIngredientsMap] = useState({});

  const intervalIdRef = useRef(null);

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

  // Fetch ingredients and create a map
  const fetchIngredients = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/ingredients`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch ingredients");
      }

      const data = await response.json();
      const map = {};
      data.ingredients.forEach((ingredient) => {
        map[ingredient.id] = ingredient.name;
      });
      setIngredientsMap(map);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const handleArrivalClick = async (order) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/orders/${
          order.id
        }/notify-arrival`,
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
        `${import.meta.env.VITE_BASE_URL}/api/orders/${
          orderToDelete.id
        }/status`,
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

  const fetchOrderStatuses = useCallback(async () => {
    console.log("Fetching order statuses..."); // Add this to confirm polling
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/orders/statuses`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order statuses");
      }

      const data = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const updatedStatus = data.orders.find((o) => o.id === order.id);
          return updatedStatus
            ? { ...order, status: updatedStatus.order_status }
            : order;
        })
      );
    } catch (error) {
      console.error("Error fetching order statuses:", error);
    }
  }, []); // Empty dependency array for fetchOrderStatuses

  // Memoize fetchOrders
  const fetchOrders = useCallback(async () => {
    console.log("Fetching initial orders..."); // Add this to confirm initial fetch
    try {
      const authToken = localStorage.getItem("auth_token");
      let loggedInOrders = [];
      let guestOrders = [];

      if (authToken) {
        const profileResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/user/profile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const profileData = await profileResponse.json();
        const customerId = profileData.id;

        const allOrdersResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/orders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!allOrdersResponse.ok) {
          throw new Error("Failed to fetch all orders");
        }

        const allOrdersData = await allOrdersResponse.json();
        loggedInOrders = allOrdersData.orders.filter(
          (order) => order.customer_id === customerId
        );
      }

      const customerTempId = localStorage.getItem("customer_generated_id");
      const customerIp = localStorage.getItem("customer_ip");

      const guestOrdersResponse = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/orders/user?customer_ip=${customerIp}&customer_temp_id=${customerTempId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
        }
      );

      if (!guestOrdersResponse.ok) {
        throw new Error("Failed to fetch guest orders");
      }

      const guestOrdersData = await guestOrdersResponse.json();
      guestOrders = guestOrdersData.orders;

      const allOrders = [...loggedInOrders, ...guestOrders];
      allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const mappedOrders = allOrders.map((order) => ({
        id: order.id,
        date: new Date(order.order_date_time).toLocaleString(),
        status: order.order_status,
        payment_status: order.payment_status,
        arrived: !!order.arrived,
        total: parseFloat(order.total_price),
        is_remote: order.order_type === "remote",
        items: order.order_items.map((item) => ({
          id: item.id,
          name: item.menu_item.name,
          price: parseFloat(item.menu_item.price),
          quantity: item.quantity,
          excluded_ingredients: item.excluded_ingredients,
          image: `${import.meta.env.VITE_BASE_URL}/storage/${
            item.menu_item.image
          }`,
        })),
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []); // Empty dependency array for fetchOrders

  // --- Effect 1: Initial Data Fetch and Cleanup for the interval ---
  useEffect(() => {
    // This effect runs once on mount to fetch initial orders.
    fetchOrders();

    // The cleanup function for this useEffect is critical.
    // It will always run when the component unmounts.
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null; // Clear the ref
        console.log("INTERVAL CLEARED on OrderStatus unmount."); // Confirm cleanup
      }
    };
  }, [fetchOrders]); // Dependency on memoized fetchOrders

  // --- Effect 2: Manage the Polling Interval ---
  useEffect(() => {
    // Clear any existing interval before setting a new one
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      console.log(
        "Previous interval stopped due to orders.length or location change."
      );
    }

    // Start a new interval ONLY if there are orders AND we are on the /orders path
    if (orders.length > 0 && location.pathname === "/orders") {
      intervalIdRef.current = setInterval(fetchOrderStatuses, 2000);
      console.log("New interval started for order status polling.");
    } else {
      console.log(
        "Conditions not met for starting interval (no orders or not on /orders page)."
      );
    }

    // This effect depends on orders.length (to start/stop polling based on data)
    // and location.pathname (to stop polling if we navigate away).
    // It also depends on fetchOrderStatuses (though it's memoized, it's good practice).
  }, [orders.length, location.pathname, fetchOrderStatuses]);

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

      {filteredOrders.length === 0 && (
        <p className={classes.noOrderText}>You have no orders here!</p>
      )}
      <div className={classes.ordersContainer}>
        {filteredOrders.map((order) => (
          <div key={order.id} className={classes.orderCard}>
            <div className={classes.orderHeader}>
              <div className={classes.orderInfo}>
                <h3>
                  Order #{order.id}{" "}
                  {order.payment_status.toLowerCase() === "completed" &&
                    "(Paid)"}
                </h3>
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
              {order.items.map((item, itemIndex) => {
                // Parse excluded ingredients
                let excludedIngredients = [];
                if (item.excluded_ingredients) {
                  try {
                    excludedIngredients = JSON.parse(item.excluded_ingredients);
                  } catch (error) {
                    console.error("Error parsing excluded ingredients:", error);
                  }
                }

                return (
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
                      {/* Display excluded ingredients */}
                      {excludedIngredients.length > 0 && (
                        <div className={classes.excludedIngredients}>
                          <span>Excluded:</span>{" "}
                          {excludedIngredients
                            .map(
                              (id) => ingredientsMap[id] || `Ingredient ${id}`
                            )
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={classes.orderFooter}>
              <div className={classes.PriceNButtons}>
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

              {/* Add Pay Button */}
              {order.payment_status.toLowerCase() !== "completed" &&
                order.status.toLowerCase() !== "completed" &&
                order.status.toLowerCase() !== "canceled" && (
                  <button
                    className={`${classes.actionButton} ${classes.payButton}`}
                    onClick={() =>
                      navigate(`/payment/${order.total}/${order.id}`)
                    }
                  >
                    Pay
                  </button>
                )}
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
