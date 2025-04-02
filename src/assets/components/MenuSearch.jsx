import { useState, useEffect } from "react";
import axios from "axios";
import classes from "./MenuSearch.module.css";
import { FaFilter } from "react-icons/fa";
import MenuItem from "./MenuItem";
import Modal from "./Modal";
import CartSummary from "./CartSummary";
import MessageModal from "./MessageModal";

function MenuSearch() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState("food");
  const [currentLunchPage, setCurrentLunchPage] = useState(1);
  const [currentBreakfastPage, setCurrentBreakfastPage] = useState(1);
  const [currentDinnerPage, setCurrentDinnerPage] = useState(1);
  const [currentDrinkPage, setCurrentDrinkPage] = useState(1);
  const [isCartSummaryVisible, setIsCartSummaryVisible] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [allTagNames, setAllTagNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderError, setOrderError] = useState(null)
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const itemsPerPage = 8;
  const drinkItemsPerPage = 16;

  const cartItems = JSON.parse(localStorage.getItem('cart'));

  // Fetch menu items from the API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/menu-items");
        const menuItems = response.data;

        // Create a Set to ensure unique tag names
        const tagSet = new Set();

        menuItems.forEach(item => {
          item.tags.forEach(tag => {
            tagSet.add(tag.name); // Add each tag's name to the Set
          });
        });

        // Convert the Set back to an array and store it in state
        setAllTagNames([...tagSet]);

        setMenuItems(menuItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("Failed to load menu items");
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const menuTags = allTagNames;


  const toggleFilter = () => {
    setIsFilterVisible((prevState) => !prevState);
  };

  const handleTagChange = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterItems = (items) => {
    return items.filter((item) => {
      const matchesSearchTerm =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ingredients.some((ingredient) =>
          ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
  
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) =>
          item.tags.some((itemTag) => itemTag.name === tag)
        );
  
      return matchesSearchTerm && matchesTags;
    });
  };  

  const getPaginatedItems = (items, page, itemsPerPage) => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  if (loading) {
    return <p>Loading...</p>; // Loading state
  }

  if (error) {
    return <p>{error}</p>; // Error state
  }

  const foodItems = menuItems.filter((item) => item.categories.toLowerCase() === "food");
  const drinkItems = menuItems.filter((item) => item.categories.toLowerCase() === "drink");  

  const filteredFoodItems = filterItems(foodItems);
  const filteredDrinkItems = filterItems(drinkItems);

  const lunchItems = foodItems.filter(item =>
    item.tags.some(tag => tag.name.toLowerCase() === "lunch")
  );
  const breakfastItems = foodItems.filter(item =>
    item.tags.some(tag => tag.name.toLowerCase() === "breakfast")
  );
  const dinnerItems = foodItems.filter(item =>
    item.tags.some(tag => tag.name.toLowerCase() === "dinner")
  );
  const drinkItemsFiltered = drinkItems;

  const paginatedLunchItems = getPaginatedItems(lunchItems, currentLunchPage, itemsPerPage);
  const paginatedBreakfastItems = getPaginatedItems(breakfastItems, currentBreakfastPage, itemsPerPage);
  const paginatedDinnerItems = getPaginatedItems(dinnerItems, currentDinnerPage, itemsPerPage);
  const paginatedDrinkItems = getPaginatedItems(drinkItemsFiltered, currentDrinkPage, drinkItemsPerPage);

  const lunchTotalPages = Math.ceil(lunchItems.length / itemsPerPage);
  const breakfastTotalPages = Math.ceil(breakfastItems.length / itemsPerPage);
  const dinnerTotalPages = Math.ceil(dinnerItems.length / itemsPerPage);
  const drinkTotalPages = Math.ceil(drinkItemsFiltered.length / drinkItemsPerPage);

  const handleLunchPageClick = (pageNumber) => setCurrentLunchPage(pageNumber);
  const handleBreakfastPageClick = (pageNumber) => setCurrentBreakfastPage(pageNumber);
  const handleDinnerPageClick = (pageNumber) => setCurrentDinnerPage(pageNumber);
  const handleDrinkPageClick = (pageNumber) => setCurrentDrinkPage(pageNumber);

  const isSearchingOrFiltering = searchTerm !== "" || selectedTags.length > 0;

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const toggleCartSummary = () => {
    if (isCartSummaryVisible) {
      setIsCartSummaryVisible(false);
    } else {
      setIsCartSummaryVisible(true);
    }
  };

  function checkThatFilter(clickedTagData) {
    // Check if the clicked tag is already in the selectedTags array
    setSelectedTags((prevTags) =>
      prevTags.includes(clickedTagData)
        ? prevTags.filter((t) => t !== clickedTagData)  // If already selected, remove it
        : [...prevTags, clickedTagData]  // Otherwise, add the clicked tag
    );
    closeModal();
  }
  
  return (
    <section className={classes.searchSection}>
      <div className={classes.searchNFilterSection}>
        <input
          type="text"
          name="search"
          id="searchbar"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for food or drinks..."
          className={classes.searchInputField}
        />
        <button
          type="button"
          className={classes.filterButton}
          style={{ backgroundColor: isFilterVisible ? "#fff" : "initial" }}
          onClick={toggleFilter}
        >
          <FaFilter className={classes.icon} />
          { selectedTags.length > 0 ? <p className={classes.filterNotification} /> : null }
        </button>
        {isFilterVisible && (
          <>
            <div className={classes.filterBackdrop} onClick={toggleFilter} />
            <div className={classes.filterContainer}>
              <div className={classes.filterName}>Filters</div>
              <div className={classes.filtertagContainer}>
                {menuTags.map((tag) => (
                  <div className={classes.cateogryContainer} key={tag}>
                    <input
                      type="checkbox"
                      name={tag}
                      id={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagChange(tag)}
                    />
                    <label htmlFor={tag}>{tag}</label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div className={classes.categoryNPriceContainer}>
        <div className={classes.categorySelector}>
          <div
            className={`${classes.foodCategory} ${
              currentCategory === "food" ? classes.active : ""
            }`}
            onClick={() => setCurrentCategory("food")}
          >
            Food
          </div>
          <div
            className={`${classes.drinkCategory} ${
              currentCategory === "drink" ? classes.active : ""
            }`}
            onClick={() => setCurrentCategory("drink")}
          >
            Drink
          </div>
        </div>
        <button type="button" className={classes.showOrdersButton} onClick={toggleCartSummary}>Checkout { cartItems && cartItems.length > 0 ? <p className={classes.checkoutNotification} /> : null }</button>
      </div>
      <div className={classes.displayContainer}>
        {currentCategory === "food" ? (
          <div className={`${classes.foodDisplayContainer} ${
            searchTerm || selectedTags.length > 0 ? classes.gridLayout : classes.columnLayout
          }`}>
            {isSearchingOrFiltering ? (
              filteredFoodItems.map((item) => (
                <MenuItem key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))
            ) : (
              <>
                <div className={classes.lunchSlider}>
                  <div className={classes.sign}>
                    <p>Lunch</p>
                    <div className={classes.horizontalLine} />
                  </div>
                  <div className={classes.foodListContainer}>
                    {paginatedLunchItems.map((item) => (
                      <MenuItem key={item.id} item={item} onClick={() => handleItemClick(item)} />
                    ))}
                  </div>
                  <div className={classes.pagination}>
                    {[...Array(lunchTotalPages).keys()].map((number) => (
                      <span
                        key={number + 1}
                        onClick={() => handleLunchPageClick(number + 1)}
                        className={`${classes.pageNumber} ${
                          currentLunchPage === number + 1 ? classes.activePage : ""
                        }`}
                      >
                        {number + 1}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={classes.breakfastSlider}>
                  <div className={classes.sign}>
                    <p>Breakfast</p>
                    <div className={classes.horizontalLine} />
                  </div>
                  <div className={classes.foodListContainer}>
                    {paginatedBreakfastItems.map((item) => (
                      <MenuItem key={item.id} item={item} onClick={() => handleItemClick(item)} />
                    ))}
                  </div>
                  <div className={classes.pagination}>
                    {[...Array(breakfastTotalPages).keys()].map((number) => (
                      <span
                        key={number + 1}
                        onClick={() => handleBreakfastPageClick(number + 1)}
                        className={`${classes.pageNumber} ${
                          currentBreakfastPage === number + 1 ? classes.activePage : ""
                        }`}
                      >
                        {number + 1}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={classes.dinnerSlider}>
                  <div className={classes.sign}>
                    <p>Dinner</p>
                    <div className={classes.horizontalLine} />
                  </div>
                  <div className={classes.foodListContainer}>
                    {paginatedDinnerItems.map((item) => (
                      <MenuItem key={item.id} item={item} onClick={() => handleItemClick(item)} />
                    ))}
                  </div>
                  <div className={classes.pagination}>
                    {[...Array(dinnerTotalPages).keys()].map((number) => (
                      <span
                        key={number + 1}
                        onClick={() => handleDinnerPageClick(number + 1)}
                        className={`${classes.pageNumber} ${
                          currentDinnerPage === number + 1 ? classes.activePage : ""
                        }`}
                      >
                        {number + 1}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={classes.drinkDisplayContainer}>
            <div className={classes.sign}>
              <p>Drinks</p>
              <div className={classes.horizontalLine} />
            </div>
            <div className={classes.foodListContainer}>
              {isSearchingOrFiltering
                ? filteredDrinkItems.map((item) => (
                    <MenuItem key={item.id} item={item} onClick={() => handleItemClick(item)} />
                  ))
                : paginatedDrinkItems.map((item) => (
                    <MenuItem key={item.id} item={item} onClick={() => handleItemClick(item)} />
                  ))}
            </div>
            {searchTerm || selectedTags.length > 0 ? null : <div className={classes.pagination}>
              {[...Array(drinkTotalPages).keys()].map((number) => (
                <span
                  key={number + 1}
                  onClick={() => handleDrinkPageClick(number + 1)}
                  className={`${classes.pageNumber} ${
                    currentDrinkPage === number + 1 ? classes.activePage : ""
                  }`}
                >
                  {number + 1}
                </span>
              ))}
            </div> }
          </div>
        )}
      </div>

      {/* Render Modal */}
      {isModalVisible && (
        <Modal selectedItem={selectedItem} onCloseModal={closeModal} onTagClicked={(sentClickedTagData) => {checkThatFilter(sentClickedTagData)}} />
      )}

      {/* Render Cart Summary */}
      { isCartSummaryVisible && (
        <CartSummary closeBackdrop={toggleCartSummary} successMessage={(isItError) => {setOrderError(isItError)}} />
      )}

      {/* Render Message */}
      { orderError !== null ? <MessageModal isItError={orderError} message={orderError ? "Something must be wrong from our side, order was not successful! Please try to contact a waiter if you can! Thank you for your patience!" : "Ordered placed successfully"} closeMessageBackdrop={() => {setOrderError(null)}} /> : null}
    </section>
  );
}

export default MenuSearch;
