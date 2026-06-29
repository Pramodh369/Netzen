import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../../services/postService";

const initialState = {
  posts: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getPosts = createAsyncThunk(
  "posts/getAll",
  async (_, thunkAPI) => {
    try {
      return await postService.getPosts();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createPost = createAsyncThunk(
  "posts/create",
  async (postData, thunkAPI) => {
    try {
      return await postService.createPost(postData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ postId, content }, thunkAPI) => {
    try {
      return await postService.updatePost(postId, { content });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, text }, thunkAPI) => {
    try {
      return await postService.addComment(postId, text);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, thunkAPI) => {
    try {
      return await postService.toggleLike(postId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkAPI) => {
    try {
      await postService.deletePost(postId);
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post,
        );
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post,
        );
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post,
        );
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = postSlice.actions;
export default postSlice.reducer;
