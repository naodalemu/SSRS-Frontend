import React from 'react';
import classes from "./MenuItem.module.css";

function MenuItem({ item, onClick, onAddItem }) {
    // Function to truncate text with a max character limit
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className={classes.menuItem} onClick={onClick}>
            <div className={classes.imgNContent}>
                <div className={classes.imageContainer} style={{ backgroundImage: `url(http://127.0.0.1:8000/storage/${item.image})` }} />
                <div className={classes.menuItemContent}>
                    <h3 className={classes.itemName}>{truncateText(item.name, 30)}</h3>
                    <p className={classes.itemDesc}>{truncateText(item.description, 80)}</p>
                    <div className={classes.ingredients}>
                        {item.ingredients.slice(0, 4).map((ingredient, index) => (
                            <span key={index} className={classes.ingredient}>{ingredient.name}</span>
                        ))}
                        {item.ingredients.length > 4 && <span className={classes.moreIngredients}>...</span>}
                    </div>
                </div>
            </div>
            <p className={classes.price}>${item.price}</p>
        </div>
    );
}

export default MenuItem;
