import { Link } from "react-router-dom";
import "./NavBar.css";
import { logout } from "../api/auth";
const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">
        FIND<span className="gray-text">IIT</span>
      </h1>
      <div className="nav-links">
        <Link to="/dashboard" className="nav-link">Home</Link>
        {/* <Link to="/my-items" className="nav-link">My Items</Link> */}
        {/* <Link to="/map" className="nav-link">Map</Link> */}
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="/login" className="nav-link" onClick={logout}> Logout </Link>
      </div>
    </nav>
  );
};

export default Navbar;
