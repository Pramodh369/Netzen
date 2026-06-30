import axios from "axios";

const BASE_URL = "/api/auth";

const getToken = () => {
  return localStorage.getItem("netzen_token");
};

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

const getProfile = async () => {
  const token = getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${BASE_URL}/profile`, config);
  return response.data;
};

const getUserProfile = async (username) => {
  const token = getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${BASE_URL}/profile/${username}`, config);
  return response.data;
};

const updateProfile = async (profileData) => {
  const token = getToken();
  const formData = new FormData();

  formData.append("bio", profileData.bio || "");

  if (profileData.avatar) {
    formData.append("avatar", profileData.avatar);
  }

  if (profileData.coverImage) {
    formData.append("coverImage", profileData.coverImage);
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${BASE_URL}/profile`, formData, config);
  return response.data;
};

const followUser = async (userId) => {
  const token = getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${BASE_URL}/users/${userId}/follow`, {}, config);
  return response.data;
};

const unfollowUser = async (userId) => {
  const token = getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${BASE_URL}/users/${userId}/unfollow`,
    {},
    config
  );
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
};

export default authService;
