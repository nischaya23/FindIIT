import './ProfileLayout.css';
import './ProductGrid'
import ProductGrid from './ProductGrid';


const ProfileLayout = ({ user, setIsEditing, isEditing, products, handleChange, handleSubmit, self, formData }) => {
    return (
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
                {self &&
                    <button onClick={() => setIsEditing(!isEditing)} className="btn btn-blue">
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                }
            </div>

            {!isEditing ? (
                <div>
                    <div className="info-card">
                        <h3>Personal Information</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
                        <p><strong>Department:</strong> {user.department || "N/A"}</p>
                        <p><strong>Designation:</strong> {user.designation || "N/A"}</p>
                    </div>
                    <ProductGrid products={products} />
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
    );
};

export default ProfileLayout;