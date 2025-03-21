import { useState } from "react";
import { createProduct } from "../api/products";
import "./AddItem.css";
import NavBar from "../components/NavBar";

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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "uploadedImage") {
            setNewProduct((prev) => ({
                ...prev,
                uploadedImage: files[0],
            }));
        } else if (name === "latitude" || name === "longitude") {
            setNewProduct((prev) => ({
                ...prev,
                coordinates: { ...prev.coordinates, [name]: value },
            }));
        } else {
            setNewProduct((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in newProduct) {
            if (key === "coordinates") {
                formData.append("coordinates[latitude]", newProduct.coordinates.latitude);
                formData.append("coordinates[longitude]", newProduct.coordinates.longitude);
            } else {
                formData.append(key, newProduct[key]);
            }
        }

        try {
            await createProduct(formData).then((res) => alert(res.data.message));
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div>
            <NavBar />
            <main className="container">
                <div className="form-box">
                    <h2 className="form-title">Report an Product</h2>

                    <form onSubmit={handleAddProduct}>
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
                            <label className="label">Latitude</label>
                            <input type="text" name="latitude" value={newProduct.coordinates.latitude} onChange={handleChange} className="input-field" />
                        </div>

                        <div className="form-group">
                            <label className="label">Longitude</label>
                            <input type="text" name="longitude" value={newProduct.coordinates.longitude} onChange={handleChange} className="input-field" />
                        </div>

                        <div className="form-group">
                            <label className="label">Contact Details</label>
                            <input type="text" name="contactDetails" value={newProduct.contactDetails} onChange={handleChange} className="input-field" placeholder="Phone number, email, etc." />
                        </div>

                        <div className="form-group">
                            <label className="label">Image URL</label>
                            <input type="file" name="uploadedImage" onChange={handleChange} accept="image/*" />
                        </div>

                        <button type="submit" className="submit-button">
                            Submit Report
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddProduct;
