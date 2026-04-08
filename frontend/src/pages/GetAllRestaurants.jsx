import React, { useEffect, useState } from "react";
import { getAllRestaurants } from "../services/restaurantService";
import Navbar from "../components/Navbar";

function GetAllRestaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    const result = await getAllRestaurants();

    if (result.error === null) {
      setRestaurants(result.data);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h3 className="text-center mb-4">All Restaurants</h3>

        <div className="row">
          {restaurants.length > 0 ? (
            restaurants.map((r) => (
              <div className="col-md-3 mb-3" key={r._id}>
                <div className="card p-3">
                  <h5>{r.name}</h5>
                  <p>{r.location}</p>
                  <span>⭐ {r.rating}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No restaurants found</p>
          )}
        </div>
      </div>
    </>
  );
}

export default GetAllRestaurants;