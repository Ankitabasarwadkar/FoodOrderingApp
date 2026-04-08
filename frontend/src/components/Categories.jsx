import "../styles/categories.css";
// import { FaPizzaSlice, FaHamburger, FaIceCream, FaCoffee } from "react-icons/fa";
// import { GiSushis } from "react-icons/gi";
import {
  FaPizzaSlice,
  FaHamburger,
  FaIceCream,
  FaCoffee,
  FaLeaf
} from "react-icons/fa";

import { GiCakeSlice } from "react-icons/gi";
import { MdRamenDining } from "react-icons/md";
import { TbSalad } from "react-icons/tb";

const Categories = () => {
  const categories = [
    { name: "Pizza", icon: <FaPizzaSlice /> },
    { name: "Burgers", icon: <FaHamburger /> },
    { name: "Desserts", icon: <FaIceCream /> },
    { name: "Coffee", icon: <FaCoffee /> },
    { name: "Salads", icon: <TbSalad /> },
    { name: "Cakes", icon: <GiCakeSlice /> },
    { name: "Asian", icon: <MdRamenDining /> },
    { name: "Italian", icon: <FaLeaf /> }
  ];

  return (
    <div className="categories">
      <h2>Explore Categories</h2>

      <div className="category-container">
        {categories.map((cat, index) => (
          <div className="category-card" key={index}>
            <div className="icon">{cat.icon}</div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;