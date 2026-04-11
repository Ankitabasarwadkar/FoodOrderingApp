import { Routes, Route, Navigate } from "react-router"
import { createContext, useState } from "react"
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedRestaurants from "./components/FeaturedRestaurants";
import GetAllRestaurants from "./pages/GetAllRestaurants";
import RestaurantMenu from "./pages/RestaurantMenu";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import Profile from"./pages/Profile";
import { ToastContainer } from "react-toastify"

export const LoginContext = createContext()
function App() {
  
    
    const [loginStatus, setLoginStatus] = useState(
    sessionStorage.getItem("token") ? true : false
  )
const role=sessionStorage.getItem("role");
  return (
     <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
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
          <Route
          path="/profile"
          element={loginStatus ? <Profile /> : <Navigate to="/login" />}
        />
        {/* Restaurant Menu */}
        <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
           <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/cart" element={<Cart />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
   </LoginContext.Provider>
  );
}

export default App;