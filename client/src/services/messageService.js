import axios from "axios";

const BASE_URL = "/api/messages";

const getToken = () => localStorage.getItem("netzen_token");

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const getConversations = async () => {
  const response = await axios.get(`${BASE_URL}/conversations`, authConfig());
  return response.data;
};

const getMessages = async (userId) => {
  const response = await axios.get(`${BASE_URL}/${userId}`, authConfig());
  return response.data;
};

const messageService = {
  getConversations,
  getMessages,
};

export default messageService;
