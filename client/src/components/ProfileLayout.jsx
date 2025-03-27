import './ProfileLayout.css';
import './ProductGrid'
import {Link} from "react-router-dom";
// import ProductGrid from './ProductGrid';



const ProfileLayout = ({ user, setIsEditing, isEditing, products, handleChange, handleSubmit, self, formData , preview}) => {
    return (
        <div className="profile-container">

            <div className="profile-card">
                <div className="profile-info">
                    <img
                        src={preview || `http://localhost:5000${user.profilePicture}` || "http://www.gravatar.com/avatar/0e39d18b89822d1d9871e0d1bc839d06?s=128&d=identicon&r=PG"}
                        alt="Profile"
                        className="profile-img"
                    />
                    <div>
                        <h2>{user.name || "Name"}</h2>
                        <p className="text-muted">IIT Kanpur</p>
                    </div>
                </div>
                {self && !isEditing && <Link to={`/previous-chats`}><button className="userProfileChatBtn">{"My Chats"}</button></Link>}
                {!self && !isEditing && <Link to={`/chat/${user._id}`}><button className="userProfileChatBtn">{"Chat with User"}</button></Link>}
                {self &&
                    <button onClick={() => setIsEditing(!isEditing)} className="userProfileEditBtn">
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                }
            </div>

            {!isEditing ? (
                <div>
                    <div className="userProfileInfoCard">
                            <h3 className="userProfileInfoTitle">Personal Information</h3>
                            <div className="userProfileInfoDetails">
                                <div className="userProfileInfoRow">
                                    <span className="userProfileLabel">Email:</span>
                                    <span>{user.email || "Not Provided"}</span>
                                </div>
                                <div className="userProfileInfoRow">
                                    <span className="userProfileLabel">Phone Number:</span>
                                    <span>{user.phone || "Not Provided"}</span>
                                </div>
                        {/* <div className="userProfileInfoRow">
                            <span className="userProfileLabel">ID Number:</span>
                            <span>{user.idNumber || "N/A"}</span>
                        </div> */}
                                <div className="userProfileInfoRow">
                                    <span className="userProfileLabel">Designation:</span>
                                    <span>{user.designation || "N/A"}</span>
                                </div>
                                <div className="userProfileInfoRow">
                                    <span className="userProfileLabel">Department:</span>
                                    <span>{user.department || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                        {/* <ProductGrid products={products} /> */}
                </div>
                    
                // </div>
            ) : (
                <form onSubmit={handleSubmit} className="info-card">
                    <h3>Edit Profile</h3>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input-field" />
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="input-field" />
                    <select name="department" value={formData.department} onChange={handleChange} className='input-field'>
                        <option>Computer Science</option>
                        <option>Electrical Engineering</option>
                        <option>Statistics and Data Science</option>
                        <option>Mathematics and scientific computing</option>
                        <option>Mechanical Engineering</option>
                        <option>Civil Engineering</option>
                        <option>Chemical Engineering</option>
                        <option>Aerospace Engineering</option>
                        <option>Economics</option>
                        <option>Biological Sciences and Biological Engineering</option>
                        <option>Chemistry</option>
                        <option>Physics</option>
                        <option>Earth Sciences</option>
                        <option>Other</option>
                    </select>
                    <select name="designation" value={formData.designation} onChange={handleChange} className='input-field'>
                        <option>Student</option>
                        <option>Faculty</option>
                        <option>Staff</option>
                    </select>
                    <div className="file-input-container">
                        <input type="file" name="profilePicture" id="fileInput" onChange={handleChange} accept="image/*" hidden/>
                        <div className="choose-file-btn">
                            <label htmlFor="fileInput" className="custom-file-button" > Choose File</label>
                        </div>
                        <span className="file-name">{formData.profilePicture ? formData.profilePicture.name : "No file chosen"}</span>
                        <button type="submit" className="btn btn-green">Save</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProfileLayout;
