import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, deleteProduct, claimProduct, updateClaimStatus } from "../api/products";
import { getID } from "../api/auth";
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

    const handleDeleteProduct = async () => {
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
            if(product.itemStatus === "Lost") alert("Potential match request submitted!");
            if(product.itemStatus === "Found") alert("Claim request submitted!");
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
        <div>
            <NavBar />
            <div className="details-container">
                <div className="details-card">
                    <div className="details-header">
                        <h2>Lost Item Details</h2>
                        <span className={`status ${product.itemStatus === "Lost" ? "lost" : "found"}`}>
                            {product.itemStatus}
                        </span>
                    </div>

                    <div className="details-grid">
                        <div className="details-left">
                            <img src={`http://localhost:5000${product.uploadedImage}`} alt={product.description} className="item-image" />
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
                                        <label>Posted By</label>
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
                                <button className="claim-product" onClick={handleClaimProduct}>
                                    {/* {product.itemStatus === "Lost" ? "Report Potential match Product" : "Claim Product"} */}
                                    Claim Product
                                </button>
                            )}
                            {userID === product.uploadedBy && (
                                <button className="delete-btn" onClick={handleDeleteProduct}>
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Claims Section */}
                    {product.claims.length > 0 && (
                        <div className="claims-section">
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
            <AddButton />
        </div>
    );
};

export default ProductDetails;
