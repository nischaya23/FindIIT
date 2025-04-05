import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, deleteProduct, claimProduct, updateClaimStatus } from "../api/products";
import { getID, getAdmin } from "../api/auth";
import "../pages/ProductDetails.css";
import NavBar from "../components/NavBar";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import AddButton from "../components/AddButton";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
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

    const fetchProduct = async () => {
        try {
            const res = await getProductById(id);
            setProduct(res.data.data);
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
            <AddButton />
        </div>
    );
};

export default ProductDetails;
