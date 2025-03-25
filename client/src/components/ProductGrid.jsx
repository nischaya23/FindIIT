import "./ProductGrid.css"
import ProductCard from "./ProductCard"

const ProductGrid = ({ products }) => {
    return (
        <div className="product-grid">
            {products?.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};
export default ProductGrid;