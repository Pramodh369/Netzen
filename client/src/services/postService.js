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

  if (postData.image) {
    const formData = new FormData();
    formData.append("content", postData.content);
    formData.append("image", postData.image);

    const response = await axios.post(API_URL, formData, config);
    return response.data;
  }

  const response = await axios.post(API_URL, { content: postData.content }, config);
  return response.data;
};

// Update post
const updatePost = async (postId, postData) => {
  const token = getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${postId}`, postData, config);
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
// Delete post
const deletePost = async (postId) => {
  const token = getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${postId}`, config);

  return response.data;
};

const postService = {
  getPosts,
  createPost,
  updatePost,
  toggleLike,
   addComment,
     deletePost,
};

export default postService;
