import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../api/products";
import "../pages/ProductDetails.css";
import NavBar from "../components/NavBar";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await getProductById(id);
                setProduct(res.data.data);
            } catch (error) {
                alert(error.response?.data?.message || "An error occurred");
            }
        };
        getProduct();
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <div>
            <NavBar />
            <div className="details-container">
                <div className="details-card">
                    <div className="details-header">
                        <h2>Lost Item Details</h2>
                        <span className={`status ${product.itemStatus === "lost" ? "lost" : "found"}`}>
                            {product.itemStatus}
                        </span>
                    </div>

                    <div className="details-grid">
                        <div className="details-left">
                            <img src={`http://localhost:5000${product.uploadedImage}`} alt={product.description} className="item-image" />
                            <div className="location-section">
                                <h3>Location</h3>
                                <img src="/maps.png" alt="Map" className="map-image" />
                                <p>Latitude: {product.coordinates?.lat}, Longitude: {product.coordinates?.lng}</p>
                            </div>
                        </div>

                        <div className="details-right">
                            <div className="info-section">
                                <h3>Item Information</h3>
                                <div className="info-content">
                                    <div>
                                        <label>Category</label>
                                        <p>{product.category}</p>
                                    </div>
                                    <div>
                                        <label>Description</label>
                                        <p>{product.description}</p>
                                    </div>
                                    <div>
                                        <label>Tags</label>
                                        <div className="tags">
                                            {product.tags.map((tag, index) => (
                                                <span key={index} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="info-section">
                                <h3>Contact Information</h3>
                                <div className="info-content">
                                    <div>
                                        <label>Posted By</label>
                                        <p>{product.contactDetails?.name}</p>
                                    </div>
                                    <div>
                                        <label>Contact Details</label>
                                        <p>{product.contactDetails?.phone}</p>
                                        <p>{product.contactDetails?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-section">
                                <h3>Time Information</h3>
                                <div className="info-content">
                                    <div>
                                        <label>Lost Date</label>
                                        <p>{product.lostDate}</p>
                                    </div>
                                    <div>
                                        <label>Posted Date</label>
                                        <p>{product.postedDate}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="contact-btn">Contact</button>
                            <button className="claim-product">Claim product</button>
                        </div>
                    </div>
                </div>
            </div>
            <a href="/add_item" className="floating-button">
                +
            </a>
        </div>
    );
};

export default ProductDetails;
