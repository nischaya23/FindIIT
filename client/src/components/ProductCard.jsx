import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
    return (
        <Link to={`/product/${product._id}`} className="product-card-link">
            <div className="product-card">
                <span className={`status-badge ${product.claimed ? "resolved" : product.itemStatus === "Lost" ? "lost" : "found"}`}>
                    {product.claimed ? "RESOLVED" : product.itemStatus.toUpperCase()}
                </span>
                {typeof product.closeness === "number" && (
                    <div className="closeness-score">{Math.round(product.closeness)}% match</div>
                )}
                <br></br>
                <img src={`${import.meta.env.VITE_API_URL}${product.uploadedImage}`} className="product-image"onError={(e) => e.target.src = "/no-image.png"} alt="Product"/>
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