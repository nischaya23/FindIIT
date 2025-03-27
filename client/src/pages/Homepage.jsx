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
  const handleSearch = async (search = "") => {
    try {
      const res = await getProducts(search);
      setProducts(res.data.data);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    // Initially fetch all products (or an empty search)
    handleSearch(searchTerm);
  }, [searchTerm]);

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

      {/* Example "Browse By Category" section */}
      <div className="browse-section" ref={browseSectionRef}>
        <h2>Browse By Category</h2>
        <p>Find your lost items faster by browsing through our organized categories.</p>

        <div className="category-container">
          {/* Example cards */}
          <div className="category-card">
            <img src="..\..\public\electronics.png" alt="Electronics" />
            <h3>Electronics</h3>
            <p>127 items</p>
          </div>
          <div className="category-card">
            <img src="..\..\public\keys.png" alt="Keys" />
            <h3>Keys</h3>
            <p>80 items</p>
          </div>
          {/* Add more cards as needed */}
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