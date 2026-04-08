import { Link } from "react-router-dom";
import "../styles/navbar.css";
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-left">
        <h2 className="logo">FoodFlow</h2>
      </div>

      <div className="nav-center">
        <input
          type="text"
          placeholder="Search for restaurants, cuisines..."
        />
      </div>

      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        <button className="signin-btn">Sign In</button>
      </div>
    </div>
  );
};

export default Navbar;