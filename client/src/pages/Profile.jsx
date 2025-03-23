import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/users";
import NavBar from "../components/NavBar";
import "./Profile.css";
import Navbar from "../components/NavBar";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        department: "",
        designation: "",
        profilePicture: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                setUser(res.data.data);
                setFormData({
                    name: res.data.data.name || "",
                    phone: res.data.data.phone || "",
                    department: res.data.data.department || "",
                    designation: res.data.data.designation || "",
                });
            } catch (error) {
                console.error("Error fetching profile", error);
                navigate("/login");
            }
        };
        fetchProfile();
    }, [navigate]);

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

    return (
        <div>
            <Navbar />
            <div className="profile-container">

                <div className="profile-card">
                    <div className="profile-info">
                        <img
                            src={`http://localhost:5000${user.profilePicture}` || "http://www.gravatar.com/avatar/0e39d18b89822d1d9871e0d1bc839d06?s=128&d=identicon&r=PG"}
                            alt="Profile"
                            className="profile-img"
                        />
                        <div>
                            <h2>{user.name || "Name"}</h2>
                            <p className="text-muted">IIT Kanpur</p>
                        </div>
                    </div>
                    <button onClick={() => setIsEditing(!isEditing)} className="btn btn-blue">
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                </div>

                {!isEditing ? (
                    <div className="info-card">
                        <h3>Personal Information</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
                        <p><strong>Department:</strong> {user.department || "N/A"}</p>
                        <p><strong>Designation:</strong> {user.designation || "N/A"}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="info-card">
                        <h3>Edit Profile</h3>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input-field" />
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="input-field" />
                        <input name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="input-field" />
                        <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" className="input-field" />
                        <input type="file" name="profilePicture" onChange={handleChange} accept="image/*" />
                        <button type="submit" className="btn btn-green">Save</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
