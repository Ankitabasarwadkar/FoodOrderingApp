import axios from "axios";
import config from "./config";

export async function getAllRestaurants() {
  const URL = config.BASE_URL + "restaurants";

  const token = sessionStorage.getItem("token");
  const headers = { token };

  const response = await axios.get(URL, { headers });

  return response.data;
}

export async function getRestaurantById(id) {
  const URL = config.BASE_URL + "restaurants/" + id;

  const token = sessionStorage.getItem("token");
  const headers = { token };

  const response = await axios.get(URL, { headers });

  return response.data;
}