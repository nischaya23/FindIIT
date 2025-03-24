import { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import SearchBar from "../components/SearchBar";
import NavBar from "../components/NavBar";
import ProductGrid from "../components/ProductGrid";

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
        <div>
            <NavBar />
            <SearchBar onChange={(e) => handleSearch(e.target.value)} value={searchTerm} />
            <ProductGrid products={products} />
            <a href="/add_item" className="floating-button">
                +
            </a>
        </div>
    );
};

export default HomePage;
