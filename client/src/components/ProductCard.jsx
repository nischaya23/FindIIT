import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
    return (
        <Link to={`/product/${product._id}`} className="product-card-link">
            <div className="product-card">
                <span className={`status-badge ${product.itemStatus === "lost" ? "lost" : "found"}`}>
                    {product.itemStatus.toUpperCase()}
                </span>
                <img src={`http://localhost:5000${product.uploadedImage}`} alt={product.description} className="product-image" />
                <h3 className="product-title">{product.category}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-tags">
                    {product.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;