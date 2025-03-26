import { Link } from "react-router-dom";
import "./NavBar.css";
import { logout, getID } from "../api/auth";
const Navbar = () => {
  const id = getID();
  return (
    <nav className="navbar">
      <Link to="/dashboard" className="logo-link">
      <img src="./logo.svg" alt="Logo" class="nav-logo">
</img>
      </Link>
      <div className="nav-links">
        <Link to="/dashboard" className="nav-link">Home</Link>

        { <Link to="/map" className="nav-link">Map</Link> }

        <Link to={`/my-items`} className="nav-link">My Items</Link>

        <Link to={`/profile/${id}`} className="nav-link">Profile</Link>
        <Link to="/login" className="nav-link" onClick={logout}>Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
