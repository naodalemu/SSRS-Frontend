import React, { useEffect, useState } from 'react';
import classes from "./OrderStatus.module.css"; // Import the CSS module for styling

function OrderStatus() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get customer_ip and customer_generated_id from local storage
    const customerIp = localStorage.getItem('customer_ip');
    const customerGeneratedId = localStorage.getItem('customer_generated_id');

    useEffect(() => {
        // Fetch the user's orders using customer_ip and customer_generated_id
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/orders?customer_ip=${customerIp}&customer_generated_id=${customerGeneratedId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data.orders);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [customerIp, customerGeneratedId]);

    if (isLoading) {
        return <p className={classes.loading}></p>;
    }

    if (error) {
        return <p className={classes.error}>Error: {error}</p>;
    }

    // Function to truncate text with a max character limit
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const possibleStatusesBorder = {
        pending: "2px solid gray",
        processing: "2px solid #90C2E7",
        ready: "2px solid #226F54",
        completed: "2px solid #333",
        cancelled: "2px solid #B3001B",
    }

    const possibleStatusesBG = {
        pending: "white",
        processing: "#90C2E7",
        ready: "#226F54",
        completed: "#333",
        cancelled: "#B3001B",
    }

    const possibleStatusesColor = {
        pending: "black",
        processing: "black",
        ready: "white",
        completed: "white",
        cancelled: "white",
    }

    return (
        <div className={classes.orderStatusContainer}>
            {orders.length === 0 ? (
                <p className={classes.noOrders}>No orders found</p>
            ) : (
                <div className={classes.orderList}>
                    {orders.map(order => (
                        <div className={classes.orderCard} key={order.id}>
                            <div className={classes.topPart}>
                                <div className={classes.topLeft}>
                                    <h2>#{order.id}</h2>
                                    <h3 className={classes.tableNumber}><span className={classes.tableToolTip}>Table</span> {order.table_id}</h3>
                                </div>
                                <div className={classes.topRight}>
                                    <p>${order.total_amount}</p>
                                    <p style={{ border: possibleStatusesBorder[order.order_status] ? possibleStatusesBorder[order.order_status] : null, background: possibleStatusesBG[order.order_status] ? possibleStatusesBG[order.order_status] : null, color: possibleStatusesColor[order.order_status] ? possibleStatusesColor[order.order_status] : null }}>{order.order_status}</p>
                                </div>
                            </div>
                            <div className={classes.ticketTrick}>
                                <div className={classes.leftCircle} />
                                <div className={classes.dashes} />
                                <div className={classes.rightCircle} />
                            </div>
                            <div className={classes.bottomPart}>
                                <div className={classes.itemsList}>
                                    {order.order_items.map(item => (
                                        <div className={classes.singleItem} key={item.id}>
                                            <div className={classes.imageContainer} style={{ backgroundImage: `url(http://127.0.0.1:8000/storage/${item.menu_item.image})` }} />
                                            <div className={classes.singleItemContent}>
                                                <h3 className={classes.singleItemName}>{truncateText(item.menu_item.name, 30)}</h3>
                                                <div className={classes.priceNQty}>
                                                    <p className={classes.singleItemPrice}>${item.menu_item.price}</p>
                                                    <p className={classes.singleItemQuantity}>{item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderStatus;
