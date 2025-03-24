import { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import NavBar from "../components/NavBar";
import "./Homepage.css";

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);

    const handleSearch = async (search = "") => {
        setSearchTerm(search);
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
            <div className="product-grid">
                {products?.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            <div className="spacer"></div>
            <a href="/add_item" className="floating-button">
                +
            </a>
        </div>
    );
};

export default HomePage;
