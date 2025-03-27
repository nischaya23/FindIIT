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
        handleSearch();
    }, []);

    return (

        <div className="homepage-container">
            <NavBar />
            <SearchBar onChange={(e) => handleSearch(e.target.value)} value={searchTerm} />
            <ProductGrid products={products} />
            <div className="spacer"></div>
            <AddButton />

        </div>
        
    );
};

export default HomePage;
