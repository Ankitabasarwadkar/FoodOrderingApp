import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedRestaurants from "./components/FeaturedRestaurants";
import GetAllRestaurants from "./pages/GetAllRestaurants";
import RestaurantMenu from "./pages/RestaurantMenu";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Categories />
              <FeaturedRestaurants />
            </>
          }
        />

        {/* All Restaurants */}
        <Route path="/restaurants" element={<GetAllRestaurants />} />

        {/* Restaurant Menu */}
        <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />

      </Routes>
    </>
  );
}

export default App;