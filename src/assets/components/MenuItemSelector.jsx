import { useEffect, useState } from "react";
import classes from "./MenuItemSelector.module.css";
import { FaFilter } from "react-icons/fa";

function MenuItemSelector({ onAddItem }) {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Food");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/menuitems`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch menu items");

        const result = await response.json();

        // Process the API data to extract relevant fields
        const processedItems = result.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number.parseFloat(item.price),
          image: item.image || "default_image.jpg",
          category: item.category?.name || "Unknown",
          ingredients: item.ingredients.map((ing) => ing.name).join(", "),
          tags: item.tags.map((tag) => tag.name),
        }));

        setMenuItems(processedItems);
        setFilteredItems(processedItems);

        // Extract unique tags for filtering
        const tags = new Set();
        result.forEach((item) => {
          item.tags.forEach((tag) => tags.add(tag.name));
        });
        setAllTags([...tags]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const toggleFilter = () => {
    setIsFilterVisible((prevState) => !prevState);
  };

  // Filter items based on search term and selected tags
  useEffect(() => {
    const filtered = menuItems.filter((item) => {
      const matchesSearchTerm =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ingredients.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => item.tags.includes(tag));

      return matchesSearchTerm && matchesTags;
    });

    setFilteredItems(filtered);
  }, [searchTerm, selectedTags, menuItems]);

  const handleTagChange = (tag) => {
    setSelectedTags(
      (prevTags) =>
        prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag) // Remove tag if already selected
          : [...prevTags, tag] // Add tag if not selected
    );
  };

  if (isLoading) return <p>Loading menu items...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={classes.menuItemSelector}>
      {/* Search Bar */}
      <div className={classes.searchContainer}>
        <input
          type="text"
          placeholder="Search for food or drinks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes.searchInput}
        />
        <button
          type="button"
          className={classes.filterButton}
          style={{ backgroundColor: isFilterVisible ? "#fff" : "initial" }}
          onClick={toggleFilter}
        >
          <FaFilter className={classes.icon} />
          {selectedTags.length > 0 ? (
            <p className={classes.filterNotification} />
          ) : null}
        </button>
        {isFilterVisible && (
          <>
            <div className={classes.filterBackdrop} onClick={toggleFilter} />
            <div className={classes.filterContainer}>
              <div className={classes.filterName}>Filters</div>
              <div className={classes.filtertagContainer}>
                {allTags.map((tag) => (
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

      {/* Menu Items Grid */}
      <div className={classes.menuGrid}>
        {filteredItems.map((item) => (
          <div key={item.id} className={classes.menuCard}>
            <div className={classes.cardContent}>
              <div className={classes.imageContainer}>
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}/images/${item.image}`}
                  alt={item.name}
                  className={classes.itemImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/150?text=Image+Not+Available";
                  }}
                />
              </div>
              <h3 className={classes.itemName}>{item.name}</h3>
              <p className={classes.itemDescription}>{item.description}</p>

              <div className={classes.tagContainer}>
                {item.ingredients.split(", ").map((ingredient) => (
                  <div
                    key={ingredient}
                    className={classes.ingredient}
                    onClick={() => handleIngredientToggle(item.id, ingredient)}
                  >
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>

            <div className={classes.priceActionContainer}>
              <span className={classes.price}>{item.price.toFixed(2)} ETB</span>
              <button
                className={classes.addButton}
                onClick={() => onAddItem(item)}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuItemSelector;
