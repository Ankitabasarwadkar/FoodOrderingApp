import { useEffect, useState } from "react";
import { getAllRestaurants } from "../services/restaurantService";
import RestaurantCard from "./RestaurantCard";
import "../styles/restaurant.css";

const FeaturedRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    getAllRestaurants()
      .then(res => {
        if (res.status === "success") {
          setRestaurants(res.data);
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="featured">
      <h2>Featured Restaurants</h2>

      <div className="restaurant-container">
        {restaurants.map((item) => (
          <RestaurantCard key={item._id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedRestaurants;