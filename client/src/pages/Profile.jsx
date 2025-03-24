import { useParams } from "react-router-dom";
import { getID } from "../api/auth"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/users";
import NavBar from "../components/NavBar";
import ProfileLayout from "../components/ProfileLayout";
import { getProductsByUploader } from "../api/products";

const Profile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        department: "",
        designation: "",
        profilePicture: "",
    });
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    const handleSearch = async (id) => {
        try {
            const res = await getProductsByUploader(id);
            setProducts(res.data.data);
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred");
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile(id);
                setUser(res.data.data);
                setFormData({
                    name: res.data.data.name || "",
                    phone: res.data.data.phone || "",
                    department: res.data.data.department || "",
                    designation: res.data.data.designation || "",
                });
            } catch (error) {
                console.error("Error fetching profile", error);
                navigate("/dashboard");
            }
        };
        fetchProfile();
        handleSearch(id);
    }, [navigate, id]);

    const handleChange = (e) => {
        if (e.target.name === "profilePicture") {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] })
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfile(formData);
            setUser(res.data.data);
            setIsEditing(false);
        } catch (error) {
            console.log("Error updating profile", error);
        }
    };

    if (!user) return (
        <div>
            <NavBar />
            <p className="loading-text">Loading profile...</p>
        </div>
    );

    const self = (getID() === id);

    return (
        <ProfileLayout
            user={user}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            products={products}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            self={self}
            formData={formData}
        />
    );
};

export default Profile;
