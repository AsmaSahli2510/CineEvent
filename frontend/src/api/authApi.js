const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "token";
const CURRENT_USER_KEY = "current_user";

// Register a new spectator
export const registerSpectator = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
};

// Login with email and password
export const loginWithEmail = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
};

// Login with Google
export const loginWithGoogle = async (idToken) => {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Google login failed");
  }

  return response.json();
};

export const requestPasswordReset = async (email) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to send password reset email");
  }

  return data;
};

export const validatePasswordResetToken = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Invalid reset link");
  }

  return data;
};

export const resetPasswordWithToken = async (token, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password");
  }

  return data;
};

export const fetchCurrentProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch profile");
  }

  return response.json();
};

// Save token to localStorage
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const saveCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = () => {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  if (currentUser) {
    try {
      return JSON.parse(currentUser);
    } catch {
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }
  }

  // Migration fallback from previous key
  const legacyUser = localStorage.getItem("user");
  if (!legacyUser) {
    return null;
  }

  try {
    const parsedLegacyUser = JSON.parse(legacyUser);
    saveCurrentUser(parsedLegacyUser);
    localStorage.removeItem("user");
    return parsedLegacyUser;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const removeCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem("user");
};

export const clearAuthStorage = () => {
  removeToken();
  removeCurrentUser();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Set auth header for authenticated requests
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
