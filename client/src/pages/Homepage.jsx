import { useState, useEffect, useRef } from "react";
import { getProducts } from "../api/products";
import SearchBar from "../components/SearchBar";
import NavBar from "../components/NavBar";
import ProductGrid from "../components/ProductGrid";
import AddButton from "../components/AddButton";
import "./Homepage.css";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all"); // "all", "lost", or "found"
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category

  // 1. Create a ref for the "Browse By Category" section (or wherever your cards are)
  const browseSectionRef = useRef(null);

  // 2. Handle user input in the search bar
  const handleSearchInput = (value) => {
    setSearchTerm(value);

    // Whenever user types anything, scroll to the card section
    if (browseSectionRef.current) {
      browseSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 3. Search logic
  const handleSearch = async () => {
    try {
      const res = await getProducts(searchTerm, filter, selectedCategory);
      setProducts(res.data.data);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, filter, selectedCategory]); // API call on change

  return (
    <div className="homepage-container">
      {/* Floating Objects Container */}
      <div className="floating-objects">
        <img src="search.png" alt="Key" className="floating-object object1" />
        <img src="mortarboard.png" alt="Key" className="floating-object object2" />
        <img src="map.png" alt="Key" className="floating-object object3" />
        <img src="home.png" alt="Key" className="floating-object object4" />
        <img src="html.png" alt="Key" className="floating-object object5" />
      </div>

      <NavBar />

      <div className="hero-section">
        <h1>
          Reunite with Your <span className="highlight">Lost Belongings</span>
        </h1>
        <p>
          A simple, effective way to find lost items and return found belongings
          to their rightful owners.
        </p>
      </div>

      {/* Pass a custom onChange handler to the SearchBar */}
      <SearchBar
        onChange={(e) => handleSearchInput(e.target.value)}
        value={searchTerm}
      />

      {/* Filter Slider */}
      <div className="filter-slider">
        {["all", "lost", "found"].map((category) => (
          <button
            key={category}
            className={filter === category ? "active" : ""}
            onClick={() => { setFilter(category); if (browseSectionRef.current) { browseSectionRef.current.scrollIntoView({ behavior: "smooth" }); } }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Browse By Category */}
      <div className="browse-section" ref={browseSectionRef}>
        <h2>Browse By Category</h2>
        <p>Find your lost items faster by browsing through our organized categories.</p>

        <div className="category-container">
          {["Phone", "Wallet", "Keys", "Others"].map((category) => (
            <div
              key={category}
              className={`category-card ${selectedCategory === category ? "active" : ""}`}
              onClick={() => { setSelectedCategory(category === selectedCategory ? "" : category); if (browseSectionRef.current) { browseSectionRef.current.scrollIntoView({ behavior: "smooth" }); } }}
            >
              <img src={`/${category.toLowerCase()}.png`} alt={category} />
              <h3>{category}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Product grid or other content below */}
      <ProductGrid products={products} />

      <div className="spacer"></div>
      <AddButton />
    </div>
  );
};

export default HomePage;