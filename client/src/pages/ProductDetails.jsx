import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, deleteProduct, claimProduct, updateClaimStatus } from "../api/products";
import { getID, getAdmin } from "../api/auth";
import "../pages/ProductDetails.css";
import NavBar from "../components/NavBar";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import AddButton from "../components/AddButton";
import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../api/products";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userID = getID();
    const userAdmin = getAdmin();

    const handleDeleteProduct = async () => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        
        try {
            await deleteProduct(id);
            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred");
        }
    };

    const handleClaimProduct = async () => {
        try {
            await claimProduct(id);
            alert("Claim request submitted!");
            fetchProduct();
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred");
        }
    };

    const handleClaimStatusUpdate = async (claimID, status) => {
        try {
            await updateClaimStatus(id, claimID, status);
            alert(`Claim ${status}`);
            fetchProduct(); // Refresh claims after update
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred");
        }
    };

    const calculateCloseness = (mainProduct, candidateProduct) => {
        let score = 0;
        let total = 0;

        // Location (string match)
        total += 1;
        if (mainProduct.location && candidateProduct.location) {
            score += mainProduct.location === candidateProduct.location ? 1 : 0;
        }

        // Geographical Distance (using coordinates)
        total += 1;
        if (
            mainProduct.coordinates && candidateProduct.coordinates &&
            mainProduct.coordinates.latitude && candidateProduct.coordinates.latitude &&
            mainProduct.coordinates.longitude && candidateProduct.coordinates.longitude
        ) {
            const distance = haversineDistance(
                parseFloat(mainProduct.coordinates.latitude),
                parseFloat(mainProduct.coordinates.longitude),
                parseFloat(candidateProduct.coordinates.latitude),
                parseFloat(candidateProduct.coordinates.longitude)
            );
            const maxDistance = 10; // in km, adjust as needed
            const locScore = Math.max(0, 1 - distance / maxDistance); // Closer means higher score
            score += locScore;
        }

        // Tags overlap
        total += 1;
        const mainTags = new Set(mainProduct.tags || []);
        const candidateTags = new Set(candidateProduct.tags || []);
        const commonTags = [...mainTags].filter(tag => candidateTags.has(tag));
        score += commonTags.length / Math.max(mainTags.size, 1);

        // Description similarity
        total += 1;
        if (mainProduct.description && candidateProduct.description) {
            const descSim = basicStringSimilarity(mainProduct.description, candidateProduct.description);
            score += descSim;
        }

        // Time proximity (within 7 days)
        total += 1;
        const timeDiff = Math.abs(new Date(mainProduct.createdAt) - new Date(candidateProduct.createdAt));
        const maxTime = 1000 * 60 * 60 * 24 * 7; // 7 days in ms
        score += Math.max(0, 1 - timeDiff / maxTime);

        return Math.round((score / total) * 100); // Return score as percentage
    };

    // Haversine Distance Function (to calculate distance between two coordinates)
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = deg => deg * (Math.PI / 180);
        const R = 6371; // Radius of Earth in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // returns distance in km
    };
    
    const basicStringSimilarity = (a, b) => {
        const wordsA = new Set(a.toLowerCase().split(/\W+/));
        const wordsB = new Set(b.toLowerCase().split(/\W+/));
        const common = [...wordsA].filter(word => wordsB.has(word));
        return common.length / Math.max(wordsA.size, 1);
    };    

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await getProductById(id);
            const productData = res.data.data;
            setProduct(productData);
    
            const productsRes = await getProducts("", productData.itemStatus === "Lost" ? "Found" : "Lost", productData.category);
            const candidates = productsRes.data.data;
    
            // Filter out claimed products
            const unclaimed = candidates.filter(item => !item.claimed);
    
            const scored = unclaimed.map(item => ({
                ...item,
                closeness: calculateCloseness(productData, item)
            }));
    
            scored.sort((a, b) => b.closeness - a.closeness);
    
            setProducts(scored);
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (loading) return <div><NavBar /><p>Loading...</p></div>;
    if (!product) return <div><NavBar /><p>Product not found</p></div>;

    const coordinates = {
        lat: parseFloat(product.coordinates?.latitude) || 0,
        lng: parseFloat(product.coordinates?.longitude) || 0
    };

    return (
        <div className="whole-product-details">
            <NavBar />
            <div className="details-container">
                <div className="details-card">
                    <div className="details-header">
                        <h2>{product.itemStatus} Item Details</h2>
                        <span className={`status ${product.itemStatus === "Lost" ? "lost" : "found"}`}>
                            {product.itemStatus.toUpperCase()}
                        </span>
                    </div>

                    <div className="details-grid">
                        <div className="details-left">
                            <img src={`${import.meta.env.VITE_API_URL}${product.uploadedImage}`} className="product-image" onError={(e) => e.target.src = "/no-image.png"} alt="Product" />
                            <div className="location-section">
                                <h3>Location</h3>
                                <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                                    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                                        <Map
                                            defaultCenter={coordinates}
                                            defaultZoom={15}
                                            gestureHandling={'greedy'}
                                            disableDefaultUI={true}
                                            style={{ width: '100%', height: '100%' }}
                                        >
                                            <Marker position={coordinates} />
                                        </Map>
                                    </APIProvider>
                                </div>
                                <p>Latitude: {product.coordinates?.latitude}, Longitude: {product.coordinates?.longitude}</p>
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
                                        <label>Posted By </label>
                                        <a href={`/profile/${product.uploadedBy}`}>{product.email || "user"}</a>
                                    </div>
                                    <div>
                                        <label>Contact Details</label>
                                        <p>{product.contactDetails}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-section">
                                <h3>Time Information</h3>
                                <div className="info-content">
                                    <div>
                                        <label>Posted Date</label>
                                        <p>{new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            // minute: '2-digit',
                                            // second: '2-digit',
                                            hour12: true,
                                            // timeZoneName: 'short',
                                        }).format(new Date(product.createdAt))}</p>
                                    </div>
                                </div>
                            </div>

                            {userID !== product.uploadedBy && (
                                <div className="tooltip-container">
                                    <button 
                                        className={`claim-product ${product.claimed ? "disabled-btn" : "claim-btn"}`} 
                                        onClick={handleClaimProduct} 
                                        disabled={product.claimed}
                                    >
                                        {product.itemStatus === "Found" ? (product.claimed ? "Item Claimed" : "Claim Product") : (product.claimed ? "Item Found" : "Found Product")}
                                    </button>
                                    {product.claimed && (
                                        <span className="tooltip-text">This item has already been {product.itemStatus === "Found" ? "claimed" : "found"}.</span>
                                    )}
                                </div>
                            )}
                            {(userID === product.uploadedBy || userAdmin) && (
                                <button className="delete-btn" onClick={handleDeleteProduct}>
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="claim-section">
                    {/* Claims Section */}
                    {product.claims.length > 0 && (
                        <div className="info-section">
                            <h3>Claims</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Status</th>
                                        {userID === product.uploadedBy && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.claims.map((claim) => (
                                        <tr key={claim._id}>
                                            <td>
                                                <a href={`/profile/${claim.user}`}>{claim.email || claim.user || "user"}</a>
                                            </td>
                                            <td>{claim.status}</td>
                                            {userID === product.uploadedBy && claim.status === "Pending" && (
                                                <td>
                                                    <button className="approve-btn" onClick={() => handleClaimStatusUpdate(claim._id, "Approved")}>
                                                        Approve
                                                    </button>
                                                    <button className="reject-btn" onClick={() => handleClaimStatusUpdate(claim._id, "Rejected")}>
                                                        Reject
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    </div>
                </div>
            </div>
            <ProductGrid products={products}/>
            <AddButton />
        </div>
    );
};

export default ProductDetails;
