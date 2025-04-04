import { useParams, Link } from "react-router-dom";
import { getID, getAdmin } from "../api/auth"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, banUser, makeAdmin, unbanUser } from "../api/users";
import NavBar from "../components/NavBar";
import ProfileLayout from "../components/ProfileLayout";
import { getProductsByUploader } from "../api/products";
import "./Profile.css"
import AddButton from '../components/AddButton'

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

    const [preview, setPreview] = useState(null);

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
            const file = e.target.files[0];
            setFormData({ 
                ...formData, 
                profilePicture: file,
             })
             if(file){
                setPreview(URL.createObjectURL(file));
             }
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
        alert("Profile Updated Succesfully");
    };

    const handleBanUser = async () => {
        try {
            const res = await banUser(id);
            setUser({ ...user, isBanned: true });
            alert("User banned successfully");
        } catch (error) {
            alert(error.response.data.message);
        };
    }

    const handleUnBanUser = async () => {
        try {
            const res = await unbanUser(id);
            setUser({ ...user, isBanned: false });
            alert("User unbanned successfully");
        } catch (error) {
            alert(error.response.data.message);
        };
    }

    const handleMakeAdminUser = async () => {
        try {
            const res = await makeAdmin(id);
            alert("User made admin successfully");
        }
         catch (error) {
            alert(error.response.data.message);
        };
    }


    if (!user) return (
        <div>
            <NavBar />
            <p className="loading-text">Loading profile...</p>
        </div>
    );

    const self = (getID() === id);

    return (
    <div className="profile-page">
        <NavBar />
        <ProfileLayout
            user={user}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            products={products}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            preview={preview}
            setPreview={setPreview}
            self={self}
            formData={formData}
            setFormData={setFormData}
            userAdmin={getAdmin()}
            handleBanUser={handleBanUser}
            handleUnBanUser={handleUnBanUser}
            handleMakeAdminUser={handleMakeAdminUser}
        />
        <AddButton />
    </div>
    );
};

export default Profile;
