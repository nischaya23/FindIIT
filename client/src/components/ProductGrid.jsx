import "./ProductGrid.css"
import ProductCard from "./ProductCard"

const ProductGrid = ({ products }) => {
    return (
        <>
        <div className="product-grid">

            {products?.filter(product => !product.claimed).map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>

        {products?.filter(product => product.claimed).length > 0 && (
        <>
            <br />
            <h2 className="resolved-items-header">Resolved Items</h2>
        </>
        )}

        <div className="product-grid">
            {products?.filter(product => product.claimed).map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
        </>
    );
};
export default ProductGrid;