import { getAuthHeader } from "./authApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch wishlist");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// Add event to wishlist
export const addToWishlist = async (eventId) => {
  try {
    const response = await fetch(`${API_URL}/wishlist/${eventId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add to wishlist");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// Remove event from wishlist
export const removeFromWishlist = async (eventId) => {
  try {
    const response = await fetch(`${API_URL}/wishlist/${eventId}/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to remove from wishlist");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// Toggle wishlist
export const toggleWishlist = async (eventId) => {
  try {
    const response = await fetch(`${API_URL}/wishlist/${eventId}/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to toggle wishlist");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// Check if event is in wishlist
export const isEventInWishlist = async (eventId) => {
  try {
    const response = await fetch(`${API_URL}/wishlist/${eventId}/check`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to check wishlist");
    }
    return data;
  } catch (error) {
    throw error;
  }
};
