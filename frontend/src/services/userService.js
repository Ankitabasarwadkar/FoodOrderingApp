import axios from "axios";
import config from "./config";

// LOGIN
export async function signIn(email, password) {
  const URL = config.BASE_URL + "users/signin";

  const body = { email, password };

  const response = await axios.post(URL, body);

  return response.data;
}

// REGISTER
export async function signUp(userData) {
  const URL = config.BASE_URL + "users/signup";

  const response = await axios.post(URL, userData);

  return response.data;
}

// GET TOKEN
export function getToken() {
  return sessionStorage.getItem("token");
}

// LOGOUT
export function signOut() {
  sessionStorage.clear();
}