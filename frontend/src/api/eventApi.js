import { getAuthHeader } from "./authApi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const parseJson = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
};

export const createOrganizerEvent = async (
  payload,
  posterFile,
  galleryFiles = [],
) => {
  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));
  if (posterFile) {
    formData.append("poster", posterFile);
  }
  if (Array.isArray(galleryFiles) && galleryFiles.length > 0) {
    galleryFiles.forEach((file) => {
      formData.append("gallery", file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to create event");
  }

  return data;
};

export const getMyEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/events/mine`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch organizer events");
  }

  return Array.isArray(data?.events) ? data.events : [];
};

export const getEvents = async ({ page = 1, limit = 50, status } = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (status) {
    params.set("status", status);
  }

  const response = await fetch(`${API_BASE_URL}/events?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch events");
  }

  return {
    events: Array.isArray(data?.events) ? data.events : [],
    pagination: data?.pagination || null,
  };
};

export const updateEvent = async (eventId, payload) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to update event");
  }

  return data;
};
