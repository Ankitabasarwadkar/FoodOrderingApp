import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFoodsByRestaurant } from "../services/foodService";

function RestaurantMenu() {
  const { id } = useParams();
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    const result = await getFoodsByRestaurant(id);

    if (result.error === null) {
      setFoods(result.data);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Restaurant Menu</h3>

      <div className="row">
        {foods.map((food) => (
          <div className="col-md-3" key={food._id}>
            <div className="card p-2">
              <img
                src={`http://localhost:5000/uploads/${food.image}`}
                alt=""
                height="150"
              />

              <h5>{food.name}</h5>
              <p>{food.description}</p>
              <h6>₹ {food.price}</h6>

              <button className="btn btn-primary">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantMenu;