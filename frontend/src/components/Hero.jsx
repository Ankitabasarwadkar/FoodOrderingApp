import "../styles/hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h1>Delicious Food Delivered To Your Door</h1>

        <p>
          Order your favorite meals from the best restaurants near you.
          Fast delivery, fresh food, and amazing taste.
        </p>

        <div className="hero-buttons">
          <button className="order-btn">Order Now</button>
          <button className="menu-btn">Explore Menu</button>
        </div>
      </div>

      <div className="hero-right">
        <img src="../../../food.jfif" alt="food" />
      </div>
    </div>
  );
};

export default Hero;