import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/users";
import "./Profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        department: "",
        designation: "",
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    if (!user) return <p className="loading-text">Loading profile...</p>;

    return (
        <div className="profile-container">
            <header className="header">
                <h1 className="logo">FIND<span>IIT</span></h1>
                <nav className="nav-links">
                    <a href="#">Home</a>
                    <a href="#">My Items</a>
                    <a href="#">Map</a>
                    <a href="#">Profile</a>
                </nav>
            </header>

            <div className="profile-card">
                <div className="profile-info">
                    <img
                        src={user.profilePicture || "http://www.gravatar.com/avatar/0e39d18b89822d1d9871e0d1bc839d06?s=128&d=identicon&r=PG"}
                        alt="Profile"
                        className="profile-img"
                    />
                    <div>
                        <h2>{user.name}</h2>
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
                    <p><strong>Department:</strong> {user.department || "Computer Science"}</p>
                    <p><strong>Designation:</strong> {user.designation || "Student"}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="info-card">
                    <h3>Edit Profile</h3>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input-field" />
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="input-field" />
                    <button type="submit" className="btn btn-green">Save</button>
                </form>
            )}
        </div>
    );
};

export default Profile;
