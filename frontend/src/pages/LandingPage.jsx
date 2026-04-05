import React from "react";
import "../styles/LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const restaurants = [
    {
      name: "Burger Hub",
      type: "Fast Food",
      img: "https://source.unsplash.com/300x200/?burger",
    },
    {
      name: "Pizza Corner",
      type: "Italian",
      img: "https://source.unsplash.com/300x200/?pizza",
    },
    {
      name: "Spicy Treat",
      type: "Indian",
      img: "https://source.unsplash.com/300x200/?indian-food",
    },
  ];

  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="nav">
        <h2>🍔 Foodie</h2>
        <div>
          <button onClick={() => navigate("/login")}>Login</button>
          <button className="primary" onClick={() => navigate("/register")}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>Good Food. Fast Delivery 🚀</h1>
          <p>Order your favorite meals anytime, anywhere.</p>

          <div className="hero-btns">
            <button onClick={() => navigate("/restaurants")}>
              Explore 🍽
            </button>
            <button className="secondary" onClick={() => navigate("/orders")}>
              Orders 📦
            </button>
          </div>
        </div>

        <div className="hero-img">
          <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="card">⚡ Fast Delivery</div>
        <div className="card">🍴 Best Quality</div>
        <div className="card">💳 Secure Payment</div>
      </section>

      {/* RESTAURANTS */}
      <section className="restaurants">
        <h2>Popular</h2>
        <div className="grid">
          {restaurants.map((r, i) => (
            <div key={i} className="food-card">
              <img src={r.img} />
              <h3>{r.name}</h3>
              <p>{r.type}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>© 2026 Foodie</footer>
    </div>
  );
};

export default LandingPage;