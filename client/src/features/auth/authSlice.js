import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const storedUser = JSON.parse(localStorage.getItem("netzen_user")) || null;
const storedToken = localStorage.getItem("netzen_token") || null;

const initialState = {
  loading: false,
  user: storedUser,
  token: storedToken,
  profileUser: null,
  profilePosts: [],
  isFollowingProfile: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem("netzen_token", data.token);
      localStorage.setItem("netzen_user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await authService.logout();
      window.socket?.disconnect?.();
      localStorage.clear();
    } catch {
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, thunkAPI) => {
    try {
      return await authService.getProfile();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to load profile";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (username, thunkAPI) => {
    try {
      return await authService.getUserProfile(username);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to load profile";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      return await authService.updateProfile(profileData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to update profile";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const followUser = createAsyncThunk(
  "auth/followUser",
  async (userId, thunkAPI) => {
    try {
      return await authService.followUser(userId);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to follow user";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "auth/unfollowUser",
  async (userId, thunkAPI) => {
    try {
      return await authService.unfollowUser(userId);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to unfollow user";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.profileUser = null;
        state.profilePosts = [];
        state.isFollowingProfile = false;
        state.error = null;
      })

      // Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profileUser = action.payload.user;
        state.profilePosts = action.payload.posts;
        state.isFollowingProfile = false;
        localStorage.setItem("netzen_user", JSON.stringify(action.payload.user));
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileUser = action.payload.user;
        state.profilePosts = action.payload.posts;
        state.isFollowingProfile = action.payload.isFollowing;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profileUser = action.payload.user;
        state.profilePosts = action.payload.posts;
        state.isFollowingProfile = false;
        localStorage.setItem("netzen_user", JSON.stringify(action.payload.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.profileUser?._id === action.payload.targetUserId) {
          state.profileUser.followers = [
            ...(state.profileUser.followers || []),
            state.user._id,
          ];
          state.isFollowingProfile = action.payload.isFollowing;
        }

        if (state.user) {
          state.user.following = [
            ...(state.user.following || []),
            action.payload.targetUserId,
          ];
          localStorage.setItem("netzen_user", JSON.stringify(state.user));
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.profileUser?._id === action.payload.targetUserId) {
          state.profileUser.followers = (state.profileUser.followers || []).filter(
            (id) => id !== state.user._id
          );
          state.isFollowingProfile = action.payload.isFollowing;
        }

        if (state.user) {
          state.user.following = (state.user.following || []).filter(
            (id) => id !== action.payload.targetUserId
          );
          localStorage.setItem("netzen_user", JSON.stringify(state.user));
        }
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
