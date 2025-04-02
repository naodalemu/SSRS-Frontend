// updated OrderStatus.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./OrderStatus.module.css";
import Backdrop from "./Backdrop";
import {
  FaClock,
  FaClone,
  FaClosedCaptioning,
  FaWindows,
} from "react-icons/fa6";
import {
  FaRegWindowClose,
  FaWindowClose,
  FaWindowMaximize,
} from "react-icons/fa";

function OrderStatus() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [tooltipOrderId, setTooltipOrderId] = useState(null);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Fetch from backend in real app
    const sampleOrders = [
      {
        id: 352,
        date: "23 Feb 2021, 08:28 PM",
        status: "ready",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/garden_salad.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/grilled_salmon.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/london_cafe_map.png",
          },
        ],
      },
      {
        id: 359,
        date: "23 Feb 2021, 08:28 PM",
        status: "ready",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/garden_salad.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/grilled_salmon.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/london_cafe_map.png",
          },
        ],
      },
      {
        id: 353,
        date: "23 Feb 2021, 08:28 PM",
        status: "pending",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/mixed_berry_juice.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/root_beer.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/veggie_supreme.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/t_bone_steak.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/greek_salad.jpg",
          },
        ],
      },
      {
        id: 354,
        date: "23 Feb 2021, 08:28 PM",
        status: "processing",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/chai_tea.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/grilled_chicken.png",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/ginger_ale.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/grilled_salmon.jpg",
          },
        ],
      },
      {
        id: 355,
        date: "23 Feb 2021, 08:28 PM",
        status: "completed",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/lemon_chicken.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/mixed_berry_juice.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/ribeye_steak.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/veggie_supreme.jpg",
          },
        ],
      },
      {
        id: 356,
        date: "23 Feb 2021, 08:28 PM",
        status: "cancelled",
        arrived: false,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/classic_beef_burger.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/cappuccino.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/buffalo_wings.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/caesar_salad.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/fish_and_chips.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/carrot_juice.jpg",
          },
        ],
      },
      {
        id: 452,
        date: "23 Feb 2021, 08:28 PM",
        status: "ready",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/garden_salad.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/grilled_salmon.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/london_cafe_map.png",
          },
        ],
      },
      {
        id: 459,
        date: "23 Feb 2021, 08:28 PM",
        status: "ready",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/garden_salad.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/grilled_salmon.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/london_cafe_map.png",
          },
        ],
      },
      {
        id: 453,
        date: "23 Feb 2021, 08:28 PM",
        status: "pending",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/mixed_berry_juice.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/root_beer.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/veggie_supreme.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/t_bone_steak.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/greek_salad.jpg",
          },
        ],
      },
      {
        id: 454,
        date: "23 Feb 2021, 08:28 PM",
        status: "processing",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/chai_tea.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/grilled_chicken.png",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/ginger_ale.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/grilled_salmon.jpg",
          },
        ],
      },
      {
        id: 455,
        date: "23 Feb 2021, 08:28 PM",
        status: "completed",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/lemon_chicken.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/mixed_berry_juice.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/ribeye_steak.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/veggie_supreme.jpg",
          },
        ],
      },
      {
        id: 456,
        date: "23 Feb 2021, 08:28 PM",
        status: "cancelled",
        arrived: false,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/classic_beef_burger.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/cappuccino.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/buffalo_wings.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/caesar_salad.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/fish_and_chips.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/carrot_juice.jpg",
          },
        ],
      },
      {
        id: 552,
        date: "23 Feb 2021, 08:28 PM",
        status: "ready",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/garden_salad.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/grilled_salmon.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/london_cafe_map.png",
          },
        ],
      },
      {
        id: 559,
        date: "23 Feb 2021, 08:28 PM",
        status: "ready",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/garden_salad.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/grilled_salmon.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/london_cafe_map.png",
          },
        ],
      },
      {
        id: 553,
        date: "23 Feb 2021, 08:28 PM",
        status: "pending",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/mixed_berry_juice.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/root_beer.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/veggie_supreme.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/t_bone_steak.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/greek_salad.jpg",
          },
        ],
      },
      {
        id: 554,
        date: "23 Feb 2021, 08:28 PM",
        status: "processing",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/chai_tea.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/grilled_chicken.png",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/ginger_ale.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/grilled_salmon.jpg",
          },
        ],
      },
      {
        id: 555,
        date: "23 Feb 2021, 08:28 PM",
        status: "completed",
        arrived: true,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/lemon_chicken.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/mixed_berry_juice.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/ribeye_steak.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/veggie_supreme.jpg",
          },
        ],
      },
      {
        id: 556,
        date: "23 Feb 2021, 08:28 PM",
        status: "cancelled",
        arrived: false,
        total: 226.49,
        items: [
          {
            name: "Vegan Buddha Bowl",
            price: 5,
            quantity: 2,
            image: "src/assets/images/classic_beef_burger.jpg",
          },
          {
            name: "Caesar Salad with Grilled Chicken",
            price: 12.49,
            quantity: 7,
            image: "src/assets/images/cappuccino.jpg",
          },
          {
            name: "Rice with beef toast and chapaty",
            price: 120,
            quantity: 1,
            image: "src/assets/images/buffalo_wings.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/caesar_salad.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/fish_and_chips.jpg",
          },
          {
            name: "Pink Liquid on Glass",
            price: 2,
            quantity: 5,
            image: "src/assets/images/carrot_juice.jpg",
          },
        ],
      },
    ];
    setOrders(sampleOrders);
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "active")
      return ["ready", "pending", "processing"].includes(
        order.status.toLowerCase()
      );
    return ["completed", "cancelled"].includes(order.status.toLowerCase());
  });

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteWarning(true);
  };

  const handleDeleteConfirm = () => {
    setOrders((prev) => prev.filter((order) => order !== orderToDelete));
    setShowDeleteWarning(false);
    setOrderToDelete(null);
  };

  const handleUpdateClick = (order) => {
    navigate(`/orders/${order.id}`);
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

  return (
    <div className={classes.orderStatus}>
      <div className={classes.searchContainer}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          className={classes.searchInput}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={classes.searchButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

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
                      <p>${item.price}</p>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={classes.orderFooter}>
              <div className={classes.orderTotal}>
                <h3>${order.total}</h3>
              </div>
              <div className={classes.orderActions}>
                {activeTab === "active" &&
                  order.status.toLowerCase() === "pending" && (
                    <button
                      className={`${classes.actionButton} ${classes.updateButton}`}
                      onClick={() => handleUpdateClick(order)}
                    >
                      Update
                    </button>
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
              Are you sure you want to <strong>delete</strong> the order? If you
              have paid for the order the money will be refunded and feel free
              to order again!
            </p>
            <div className={classes.modalActions}>
              <button
                className={classes.cancelButton}
                onClick={() => setShowDeleteWarning(false)}
              >
                Cancel
              </button>
              <button
                className={classes.deleteButton}
                onClick={handleDeleteConfirm}
              >
                Delete
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
    </div>
  );
}

export default OrderStatus;
