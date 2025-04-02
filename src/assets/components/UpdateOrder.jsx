import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import classes from "./UpdateOrder.module.css"
import Backdrop from "./Backdrop"

function UpdateOrder() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [menuItems, setMenuItems] = useState([])

  // Fetch order data
  useEffect(() => {
    // In a real app, you would fetch the order from an API
    // For now, we'll use sample data
    const sampleOrder = {
      id: orderId,
      date: "23 Feb 2021, 08:28 PM",
      status: "Pending",
      items: [
        { name: "Vegan Buddha Bowl", price: 6.75, quantity: 2, image: "/assets/images/veggie_burger.png" },
        {
          name: "Caesar Salad with Grilled Chicken",
          price: 12.49,
          quantity: 7,
          image: "/assets/images/caesar_salad.png",
        },
        { name: "Caesar Salad", price: 2.49, quantity: 9, image: "/assets/images/caesar_salad.png" },
        {
          name: "Caesar Salad with Grilled Chicken",
          price: 12.49,
          quantity: 7,
          image: "/assets/images/caesar_salad.png",
        },
        {
          name: "Caesar Salad with Grilled Chicken",
          price: 12.49,
          quantity: 7,
          image: "/assets/images/caesar_salad.png",
        },
      ],
      total: 226.76,
    }
    setOrder(sampleOrder)
    setItems(sampleOrder.items)

    // Sample menu items for search
    const sampleMenuItems = [
      {
        name: "Rice with beef toast and chapaty",
        price: 120,
        image: "/assets/images/t_bone_steak.jpg",
        tags: ["Lettuce", "Rice", "Bread"],
      },
      {
        name: "Rice with beef toast and chapaty",
        price: 120,
        image: "/assets/images/t_bone_steak.jpg",
        tags: ["Lettuce", "Rice", "Bread"],
      },
      {
        name: "Rice with beef toast and chapaty",
        price: 120,
        image: "/assets/images/t_bone_steak.jpg",
        tags: ["Lettuce", "Rice", "Bread"],
      },
      {
        name: "Rice with beef toast and chapaty",
        price: 120,
        image: "/assets/images/t_bone_steak.jpg",
        tags: ["Lettuce", "Rice", "Bread"],
      },
    ]
    setMenuItems(sampleMenuItems)
  }, [orderId])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return

    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQuantity,
    }
    setItems(updatedItems)
  }

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index)
    setItems(updatedItems)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const handleUpdateOrder = () => {
    // In a real app, you would call an API to update the order
    setShowSuccessMessage(true)

    // Hide success message after 3 seconds and navigate back
    setTimeout(() => {
      setShowSuccessMessage(false)
      navigate(-1)
    }, 3000)
  }

  const handleClose = () => {
    navigate(-1)
  }

  const handleAddToOrder = (menuItem) => {
    // Check if item already exists in order
    const existingItemIndex = items.findIndex((item) => item.name === menuItem.name)

    if (existingItemIndex !== -1) {
      // Increase quantity if item already exists
      handleUpdateQuantity(existingItemIndex, items[existingItemIndex].quantity + 1)
    } else {
      // Add new item
      setItems([...items, { ...menuItem, quantity: 1 }])
    }
  }

  if (!order) {
    return <div className={classes.loading}>Loading...</div>
  }

  return (
    <div className={classes.updateOrderPage}>
      <div className={classes.orderContainer}>
        <div className={classes.orderHeader}>
          <h2>Order #{order.id}</h2>
          <button className={classes.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className={classes.orderItems}>
          {items.map((item, index) => (
            <div key={index} className={classes.orderItem}>
              <div className={classes.itemInfo}>
                <span className={classes.itemQuantity}>{item.quantity}</span>
                <span className={classes.itemName}>{item.name}</span>
                <span className={classes.itemPrice}>x ${item.price.toFixed(2)}</span>
              </div>
              <div className={classes.itemActions}>
                <button
                  className={classes.quantityButton}
                  onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                >
                  +
                </button>
                <input type="text" value={item.quantity} readOnly className={classes.quantityInput} />
                <button
                  className={classes.quantityButton}
                  onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <button className={classes.removeItemButton} onClick={() => handleRemoveItem(index)}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={classes.orderFooter}>
          <div className={classes.orderTotal}>
            <h3>Total: ${calculateTotal()}</h3>
          </div>
          <button className={classes.updateButton} onClick={handleUpdateOrder}>
            Update
          </button>
        </div>
      </div>

      <div className={classes.menuContainer}>
        <div className={classes.searchContainer}>
          <input
            type="text"
            placeholder="Search"
            className={classes.searchInput}
            value={searchTerm}
            onChange={handleSearch}
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        <div className={classes.menuItems}>
          {menuItems.map((item, index) => (
            <div key={index} className={classes.menuItem}>
              <div className={classes.menuItemImage}>
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
              </div>
              <div className={classes.menuItemDetails}>
                <h3>{item.name}</h3>
                <p className={classes.menuItemDescription}>
                  The top choice among our customers and the house special with amazing ingredients and special sauce.
                  It is the best choice for lunch
                </p>
                <div className={classes.menuItemTags}>
                  {item.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className={classes.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={classes.menuItemFooter}>
                  <span className={classes.menuItemPrice}>${item.price}</span>
                  <div className={classes.menuItemQuantity}>
                    <button className={classes.quantityCircleButton}>-</button>
                    <span>2</span>
                    <button className={classes.quantityCircleButton}>+</button>
                  </div>
                  <button className={classes.addButton} onClick={() => handleAddToOrder(item)}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <Backdrop onCloseBackdrop={() => setShowSuccessMessage(false)}>
          <div className={classes.successModal} onClick={(e) => e.stopPropagation()}>
            <h2>Successful</h2>
            <p>
              You have successfully updated your order please let us know you have arrived when you arrive so that we
              will start preparing your food
            </p>
          </div>
        </Backdrop>
      )}
    </div>
  )
}

export default UpdateOrder

