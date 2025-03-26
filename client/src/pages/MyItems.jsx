import React , {useState , useEffect } from "react";
import "./MyItems.css";
import Navbar from "../components/NavBar";
import { getProductsByUploader , deleteProduct} from "../api/products";
import { getID } from "../api/auth";
import AddButton from "../components/AddButton";
import { Link } from "react-router-dom";

const MyItems = () => {
  
  const [items, setItems] = useState([]);
  const id = getID();

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
        await deleteProduct(productId);
        // navigate(`/my-items/$(id)`);
        setItems((prevItems) => prevItems.filter((item) => item._id !== productId)); // Remove from UI
    } catch (error) {
        alert(error.response?.data?.message || "An error occurred");
    }
};

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const response = await getProductsByUploader(id);
        setItems(response.data.data);
      } catch (error) {
        console.error("Error fetching user items:", error);
      }
    };

    fetchUserItems();
    console.log(items);
  }, [id]);

  return (
    <>
    <Navbar />
    <div className="my-item-container">
      <div className="my-item-summary">
        <div className="my-item-box">Total Items <span>{items.length}</span></div>
        <div className="my-item-box">Items Lost <span>{items.filter(item => item.itemStatus === 'Lost').length}</span></div>
        <div className="my-item-box">Items Found <span>{items.filter(item => item.itemStatus === 'Found').length}</span></div>
      </div>
      <div className="my-item-list">
        {items.map((item) => (
          <Link to={`/product/${item._id}`} key={item._id} className="my-item-card">
            <img src={`http://localhost:5000${item.uploadedImage}`} alt={item.name} className="my-item-image" />
            <div className="my-item-info">
              <h3>{item.name}</h3>
              <p>📅 Posted: {item.createdAt.slice(0,10).split("-").reverse().join("-")}</p>
              <p>📍 {item.location}</p>
            </div>
            <div className="my-item-actions">
              <span className={`my-item-status ${item.itemStatus.toLowerCase()}`}>{item.itemStatus}</span>
              {/* <button className="my-item-edit">Edit</button> */}
              <button 
                  className="my-item-delete" 
                  onClick={(e) => {
                  e.stopPropagation(); // Prevent Link from triggering
                  e.preventDefault(); // Prevent navigation
                  handleDeleteProduct(item._id);
                }}
              >
                Delete</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
    <AddButton/>
    </>
  );
};

export default MyItems;
