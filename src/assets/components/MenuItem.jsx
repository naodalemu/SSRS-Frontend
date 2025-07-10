import React from "react";
import classes from "./MenuItem.module.css";

function MenuItem({ item, onClick, onAddItem, real=true }) {
  // Function to truncate text with a max character limit
  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className={classes.menuItem} onClick={onClick}>
      <div className={classes.imgNContent}>
        <div
          className={classes.imageContainer}
          style={{
            backgroundImage: real ? `url(${import.meta.env.VITE_BASE_URL}/images/${item.image})` : `url(${item.image})`,
          }}
        />
        <div className={classes.menuItemContent}>
          <h3 className={classes.itemName}>{truncateText(item.name, 30)}</h3>
          <p className={classes.itemDesc}>
            {truncateText(item.description, 80)}
          </p>
          <div className={classes.ingredients}>
            {item.ingredients.slice(0, 4).map((ingredient, index) => (
              <span key={index} className={classes.ingredient}>
                {ingredient.name}
              </span>
            ))}
            {item.ingredients.length > 4 && (
              <span className={classes.moreIngredients}>...</span>
            )}
          </div>
        </div>
      </div>
      <div className={classes.menuitemBottom}>
        <p className={classes.price}>
          {item.price.slice(0, -3)}{" "}
          <span className={classes.priceCurrency}>ETB</span>
        </p>
        <p className={classes.calories}>
          <span>{item.total_calorie}</span>
          <span className={classes.calUnit}>Cal/100g</span>
        </p>
      </div>
    </div>
  );
}

export default MenuItem;
