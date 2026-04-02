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

export const createVenueTemplate = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/venue-templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to create venue template");
  }

  return data;
};

export const updateVenueTemplate = async (templateId, payload) => {
  const response = await fetch(
    `${API_BASE_URL}/venue-templates/${templateId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to update venue template");
  }

  return data;
};

export const getVenueTemplates = async ({
  page = 1,
  limit = 20,
  status,
  q,
} = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) {
    params.set("status", status);
  }
  if (q) {
    params.set("q", q);
  }

  const response = await fetch(
    `${API_BASE_URL}/venue-templates?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    },
  );

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to load venue templates");
  }

  return data;
};

export const getVenueTemplateById = async (templateId) => {
  const response = await fetch(
    `${API_BASE_URL}/venue-templates/${templateId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    },
  );

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to load venue template");
  }

  return data;
};

export const getPublishedVenueTemplates = async () => {
  const response = await fetch(`${API_BASE_URL}/venue-templates/published`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to load published venue templates");
  }

  return data;
};

export const getPublishedVenueTemplateById = async (templateId) => {
  const response = await fetch(
    `${API_BASE_URL}/venue-templates/published/${templateId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    },
  );

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to load published venue template");
  }

  return data;
};

export const deleteVenueTemplate = async (templateId) => {
  const response = await fetch(
    `${API_BASE_URL}/venue-templates/${templateId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    },
  );

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete venue template");
  }

  return data;
};
