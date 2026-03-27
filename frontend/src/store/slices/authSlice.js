import { createSlice } from "@reduxjs/toolkit";
import {
  clearAuthStorage,
  getCurrentUser,
  getToken,
  saveCurrentUser,
  saveToken,
} from "../../api/authApi";

const buildDefaultAvatar = (name) => {
  const encodedName = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${encodedName}&background=1f2937&color=f5c065&size=128`;
};

const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    avatar: user.avatar || buildDefaultAvatar(user.name),
  };
};

const initialState = {
  currentUser: normalizeUser(getCurrentUser()),
  token: getToken(),
  isAuthenticated: Boolean(getToken() && getCurrentUser()),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const normalizedUser = normalizeUser(action.payload);
      state.currentUser = normalizedUser;
      state.token = action.payload?.token || state.token;
      state.isAuthenticated = Boolean(normalizedUser && state.token);

      if (action.payload?.token) {
        saveToken(action.payload.token);
      }
      if (normalizedUser) {
        saveCurrentUser(normalizedUser);
      }
    },
    setCurrentUser: (state, action) => {
      const normalizedUser = normalizeUser(action.payload);
      state.currentUser = normalizedUser;
      state.isAuthenticated = Boolean(normalizedUser && state.token);

      if (normalizedUser) {
        saveCurrentUser(normalizedUser);
      }
    },
    clearAuth: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      clearAuthStorage();
    },
  },
});

export const { setCredentials, setCurrentUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
