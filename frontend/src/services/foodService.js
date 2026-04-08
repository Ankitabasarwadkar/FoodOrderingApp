import axios from "axios";
import config from "./config";

// GET FOODS BY RESTAURANT
export async function getFoodsByRestaurant(restaurantId) {
  const URL = `${config.BASE_URL}food/${restaurantId}`;
  const response = await axios.get(URL);

  return response.data;
}

// ADD FOOD
export async function addFood(restaurantId, formData) {
  const URL = `${config.BASE_URL}food/${restaurantId}`;
  const response = await axios.post(URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
}

// DELETE FOOD
export async function deleteFood(id) {
  const URL = `${config.BASE_URL}food/${id}`;
  const response = await axios.delete(URL);

  return response.data;
}

// UPDATE FOOD
export async function updateFood(id, formData) {
  const URL = `${config.BASE_URL}food/${id}`;
  const response = await axios.put(URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
}