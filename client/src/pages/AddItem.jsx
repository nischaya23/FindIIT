import { useState } from "react";
import { createProduct } from "../api/products";
import "./AddItem.css";
import NavBar from "../components/NavBar";
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { toast } from 'react-toastify';

const AddProduct = () => {
    const [newProduct, setNewProduct] = useState({
        itemStatus: "",
        category: "",
        description: "",
        tags: [],
        location: "",
        coordinates: { latitude: "", longitude: "" },
        contactDetails: "",
        uploadedImage: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "uploadedImage") {
            setNewProduct((prev) => ({
                ...prev,
                uploadedImage: files[0],
            }));
        } else if (name === "tags") {
            setNewProduct((prev) => ({
                ...prev,
                tags: value.split(",").map(tag => tag.trim())
            }));
        } else {
            setNewProduct((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleMapClick = (e) => {
        const lat = e.detail.latLng.lat;
        const lng = e.detail.latLng.lng;
        
        setNewProduct((prev) => ({
            ...prev,
            coordinates: { 
                latitude: lat.toString(), 
                longitude: lng.toString() 
            }
        }));
    };

    const toggleMap = () => {
        setShowMap(!showMap);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        for (const key in newProduct) {
            if (key === "coordinates") {
                formData.append("coordinates[latitude]", newProduct.coordinates.latitude);
                formData.append("coordinates[longitude]", newProduct.coordinates.longitude);
            } else if (key === "tags") {
                newProduct.tags.forEach(tag => formData.append("tags[]", tag));
            } else if (key === "uploadedImage") {
                if (newProduct.uploadedImage) {
                    formData.append("uploadedImage", newProduct.uploadedImage);
                } else {
                    formData.append("uploadedImage", "/uploads/noImage.png");
                }
            } else {
                formData.append(key, newProduct[key]);
            }
        }

        try {
            await createProduct(formData).then((res) => toast.info(res.data.message));
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="whole-add-item">
            <NavBar />
            <main className="container">
                <div className="form-box">
                    <h2 className="form-title">Report a Product</h2>

                    <form onSubmit={handleAddProduct}>
                        {/* Form Fields */}
                        <div className="form-group">
                            <label className="label">Product Status</label>
                            <div className="radio-group">
                                <label>
                                    <input type="radio" name="itemStatus" value="Lost" checked={newProduct.itemStatus === "Lost"} onChange={handleChange} />
                                    Lost Product
                                </label>
                                <label>
                                    <input type="radio" name="itemStatus" value="Found" checked={newProduct.itemStatus === "Found"} onChange={handleChange} />
                                    Found Product
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label">Select Product Category</label>
                            <select name="category" value={newProduct.category} onChange={handleChange} className="input-field">
                                <option value="">Select</option>
                                <option value="Wallet">Wallet</option>
                                <option value="Phone">Phone</option>
                                <option value="Keys">Keys</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="label">Product Description</label>
                            <textarea name="description" value={newProduct.description} onChange={handleChange} className="input-field" rows="4" placeholder="Write a brief description of the Product"></textarea>
                        </div>

                        <div className="form-group">
                            <label className="label">Add tags (separate by commas)</label>
                            <input type="text" name="tags" value={newProduct.tags} onChange={handleChange} className="input-field" placeholder="e.g. Metal, Black, Wallet" />
                        </div>

                        <div className="form-group">
                            <label className="label">Location or Gate</label>
                            <input type="text" name="location" value={newProduct.location} onChange={handleChange} className="input-field" placeholder="Enter location" />
                        </div>

                        <div className="form-group">
                            <label className="label">Location Coordinates</label>
                            <button type="button" onClick={toggleMap} className="map-button">
                                {showMap ? "Hide Map" : "Open Map to Select Location"}
                            </button>
                            
                            {showMap && (
                                <div className="map-container" style={{ height: '400px', marginTop: '10px' }}>
                                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                                    <Map
                                        defaultZoom={14}
                                        defaultCenter={{ lat: 26.51065, lng: 80.235739 }}
                                        gestureHandling="greedy"
                                        onClick={handleMapClick}
                                        style={{ borderRadius: "10px", height: "100%" }}
                                        options={{
                                            disableDefaultUI: true,
                                            zoomControl: true,
                                            streetViewControl: false,
                                            mapTypeControl: false,
                                            fullscreenControl: false,
                                            rotateControl: false,
                                            scaleControl: false
                                        }}
                                    >
                                        {newProduct.coordinates.latitude && newProduct.coordinates.longitude && (
                                            <Marker
                                                position={{
                                                    lat: parseFloat(newProduct.coordinates.latitude),
                                                    lng: parseFloat(newProduct.coordinates.longitude)
                                                }}
                                            />
                                        )}
                                    </Map>
                                </APIProvider>
                            </div>
                            
                            )}
                            
                            {newProduct.coordinates.latitude && newProduct.coordinates.longitude && (
                                <div className="coordinates-display">
                                    <p>Selected coordinates: {newProduct.coordinates.latitude}, {newProduct.coordinates.longitude}</p>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="label">Contact Details</label>
                            <input type="text" name="contactDetails" value={newProduct.contactDetails} onChange={handleChange} className="input-field" placeholder="Phone number, email, etc." />
                        </div>

                        <div className="form-group">
                            <label className="label">Image URL</label>
                            <input type="file" name="uploadedImage" onChange={handleChange} accept="image/*" />
                        </div>

                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? "Processing..." : "Submit Report"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddProduct;
