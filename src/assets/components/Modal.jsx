import React, { useState, useEffect } from "react";
import classes from "./Modal.module.css";
import { FaWindowClose } from "react-icons/fa";
import Backdrop from "./Backdrop";

function Modal({ selectedItem, onCloseModal, onTagClicked }) {
  const [amountValue, setAmountValue] = useState(1);
  const [excludedIngredients, setExcludedIngredients] = useState([]);

  // Initialize excluded ingredients when the modal opens
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === selectedItem.id);
    if (existingItem) {
      setExcludedIngredients(existingItem.excluded_ingredients || []);
    } else {
      setExcludedIngredients([]);
    }
  }, [selectedItem]);

  const handleIngredientToggle = (ingredientId) => {
    setExcludedIngredients(
      (prev) =>
        prev.includes(ingredientId)
          ? prev.filter((id) => id !== ingredientId) // Remove if already excluded
          : [...prev, ingredientId] // Add if not excluded
    );
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      image: selectedItem.image,
      quantity: amountValue,
      excluded_ingredients: excludedIngredients, // Include excluded ingredients
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(
      (item) => item.id === selectedItem.id
    );
    if (existingItemIndex !== -1) {
      // Update the amount and excluded ingredients if it already exists
      cart[existingItemIndex].quantity += amountValue;
      cart[existingItemIndex].excluded_ingredients = excludedIngredients;
    } else {
      // Add new item
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(cart);

    // Optionally reset the amount value or close the modal
    setAmountValue(1);
    setExcludedIngredients([]);
    onCloseModal();
  };

  return (
    <Backdrop onCloseBackdrop={onCloseModal}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <div className={classes.modalContent}>
          <div
            className={classes.modalImageContainer}
            style={{
              backgroundImage: `url(http://127.0.0.1:8000/storage/${selectedItem.image})`,
            }}
          />
          <div className={classes.modalTextContainer}>
            <div className={classes.separator}>
              <h2 className={classes.modalContentName}>
                {selectedItem.name}{" "}
                <span className={classes.calories}>
                  {"("}
                  <span>{selectedItem.total_calorie}</span>{" "}
                  <span className={classes.calUnit}>Cal/100g</span>
                  {")"}
                </span>
              </h2>
              <p className={classes.modalContentDesc}>
                {selectedItem.description}
              </p>
              <div className={classes.ingredients}>
                {selectedItem.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className={`${classes.ingredient} ${
                      excludedIngredients.includes(ingredient.id)
                        ? classes.excluded
                        : ""
                    }`}
                  >
                    <label htmlFor={`ingredient-${ingredient.id}`}>
                      <input
                        type="checkbox"
                        hidden
                        id={`ingredient-${ingredient.id}`}
                        checked={excludedIngredients.includes(ingredient.id)}
                        onChange={() => handleIngredientToggle(ingredient.id)}
                      />
                      {ingredient.name} -
                    </label>
                  </div>
                ))}
              </div>
              <div className={classes.ingredients}>
                {selectedItem.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={classes.tag}
                    onClick={() => {
                      onTagClicked(tag.name);
                    }}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
            <div className={classes.modalLowerContents}>
              <p className={classes.modalContentPrice}>
                {selectedItem.price} ETB
              </p>
              <div className={classes.menuItemAmount}>
                <button
                  type="button"
                  className={`${classes.amountButton} ${classes.lowerButton}`}
                  onClick={() => {
                    setAmountValue((prevAmount) =>
                      prevAmount > 1 ? prevAmount - 1 : 1
                    );
                  }}
                >
                  -
                </button>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  className={classes.amountInput}
                  value={amountValue}
                  onChange={(e) => setAmountValue(Number(e.target.value))}
                />
                <button
                  type="button"
                  className={`${classes.amountButton} ${classes.upperButton}`}
                  onClick={() => {
                    setAmountValue((prevAmount) => prevAmount + 1);
                  }}
                >
                  +
                </button>
                <button
                  type="button"
                  className={classes.addToCartButton}
                  onClick={handleAddToCart}
                >
                  ADD
                </button>
              </div>
            </div>
            <button onClick={onCloseModal} className={classes.closeButton}>
              <FaWindowClose />
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

export default Modal;
