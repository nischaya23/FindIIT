import { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import SearchBar from "../components/SearchBar";
import NavBar from "../components/NavBar";
import "./Homepage.css";
import ProductGrid from "../components/ProductGrid";
import AddButton from "../components/AddButton";


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
        
        <div className="content-wrapper">
            <div className="header">
                <h1 className="text-wrapper">FINDIIT</h1>
                <SearchBar onChange={(e) => handleSearch(e.target.value)} value={searchTerm} />
            </div>
    
            <ProductGrid products={products} />
        </div>
    
        <AddButton />
    </div>
    
        
    );
};

export default HomePage;
