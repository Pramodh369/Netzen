import axios from "axios";

const BASE_URL = "/api/auth";

const register = async (userData) => {
  const response = await axios.post(`${BASE_URL}/register`, userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await axios.post(`${BASE_URL}/login`, credentials);
  return response.data;
};

const logout = async () => {
  return { success: true };
};

const authService = { register, login, logout };

export default authService;