import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem("netzen_token");
};

// Get all posts
const getPosts = async () => {
  const token = getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create post
const createPost = async (postData) => {
  const token = getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, postData, config);
  return response.data;
};
// Add comment
const addComment = async (postId, text) => {
  const token = getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/${postId}/comment`,
    { text },
    config
  );

  return response.data;
};

// Like / Unlike post
const toggleLike = async (postId) => {
  const token = getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/${postId}/like`,
    {},
    config
  );

  return response.data;
};

const postService = {
  getPosts,
  createPost,
  toggleLike,
   addComment,
};

export default postService;