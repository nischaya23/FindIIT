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

  const browseSectionRef = useRef(null);

  const handleSearchInput = (value) => {
    setSearchTerm(value);
    if (browseSectionRef.current) {
      browseSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
      <NavBar />
      <div className="hero-section">
        <h1>
          Reunite with Your <span className="highlight">Lost Belongings</span>
        </h1>
        <p>A simple way to find and return lost items.</p>
      </div>

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
            onClick={() => setFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Browse By Category */}
      <div className="browse-section" ref={browseSectionRef}>
        <h2>Browse By Category</h2>
        <p>Find your lost items faster by browsing categories.</p>
        <div className="category-container">
          {["Phone", "Wallet", "Keys", "Others"].map((category) => (
            <div
              key={category}
              className={`category-card ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category === selectedCategory ? "" : category)} // Toggle
            >
              <img src={`/${category.toLowerCase()}.png`} alt={category} />
              <h3>{category}</h3>
            </div>
          ))}
        </div>
      </div>

      <ProductGrid products={products} />

      <AddButton />
    </div>
  );
};

export default HomePage;
