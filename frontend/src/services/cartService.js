import axios from "axios";
import config from "./config";

function getHeaders() {
  const token = sessionStorage.getItem("token");

  return {
    headers: {
      token: token
    }
  };
}

export async function getCart() {
  const URL = `${config.BASE_URL}cart`;
  const response = await axios.get(URL, getHeaders());
  return response.data;
}

export async function addToCart(foodId) {
  const URL = `${config.BASE_URL}cart/add/${foodId}`;
  const response = await axios.post(URL, { quantity: 1 }, getHeaders());
  return response.data;
}

export async function updateQuantity(foodId, quantity) {
  const URL = `${config.BASE_URL}cart/update/${foodId}`;
  const response = await axios.put(URL, { quantity }, getHeaders());
  return response.data;
}

export async function removeItem(foodId) {
  const URL = `${config.BASE_URL}cart/${foodId}`;
  const response = await axios.delete(URL, getHeaders());
  return response.data;
}

export async function clearCart() {
  const URL = `${config.BASE_URL}cart/clear/all`;
  const response = await axios.delete(URL, getHeaders());
  return response.data;
}