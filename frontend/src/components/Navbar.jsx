import { Link, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaUserCircle,
  FaHome
} from "react-icons/fa";

import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const name = sessionStorage.getItem("name");
  const role = sessionStorage.getItem("role")?.toLowerCase();
  const isLoggedIn = !!sessionStorage.getItem("token");
console.log(name);
  const logout = () => {
    sessionStorage.clear();
    navigate("/signin");
  };
useEffect(() => {
  setOpen(false);
}, [isLoggedIn]);
  // outside click close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">FoodFlow</Link>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          className="search-input"
          placeholder="Search food..."
        />
      </div>

      <div className="navbar-right">
        <button className="icon-button" onClick={() => navigate("/")}>
          <FaHome size={20} />
        </button>

        <button className="icon-button" onClick={() => navigate("/likes")}>
          <FaHeart size={20} />
        </button>

        <button className="icon-button" onClick={() => navigate("/cart")}>
          <FaShoppingCart size={20} />
        </button>

        {!isLoggedIn ? (
          <Link to="/signin" className="signin-btn">
            <FaUserCircle /> Sign In
          </Link>
        ) : (
          <div className="user-dropdown" ref={dropdownRef}>
            <div
              className="user-name"
              onClick={() => setOpen(!open)}
            >
              <FaUserCircle size={20} />
              <span>{name}</span>
            </div>

            {open && (
              <div className="user-dropdown-menu">
                
                {(role === "customer" || role === "user") && (
                  <Link to="/profile">Profile</Link>
                )}

                {role === "admin" && (
                  <>
                    <Link to="/admin/dashboard">Dashboard</Link>
                    <Link to="/admin/add-food">Add Food</Link>
                  </>
                )}

                {role === "delivery" && (
                  <Link to="/delivery/orders">Orders</Link>
                )}

                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;