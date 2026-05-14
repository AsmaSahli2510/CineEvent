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

// ORGANIZER ROUTES - View own wallet
export const getMyWallet = async () => {
  const response = await fetch(`${API_BASE_URL}/wallets/my`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch wallet data");
  }

  return data;
};

export const getMyEarnings = async () => {
  const response = await fetch(`${API_BASE_URL}/wallets/my/earnings`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch earnings data");
  }

  return data;
};

export const getMyPayoutHistory = async (page = 1, limit = 20) => {
  const response = await fetch(
    `${API_BASE_URL}/wallets/my/payouts?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: getAuthHeader(),
    },
  );

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch payout history");
  }

  return data;
};

// ADMIN ROUTES - Manage all organizers
export const getAllOrganizersWallet = async (
  page = 1,
  limit = 10,
  sortBy = "balance",
  status = "all",
) => {
  const response = await fetch(
    `${API_BASE_URL}/wallets/organizers?page=${page}&limit=${limit}&sortBy=${sortBy}&status=${status}`,
    {
      method: "GET",
      headers: getAuthHeader(),
    },
  );

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch organizers wallet");
  }

  return data;
};

// Get specific organizer wallet details
export const getOrganizerWallet = async (organizerId) => {
  const response = await fetch(`${API_BASE_URL}/wallets/${organizerId}`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch organizer wallet");
  }

  return data;
};

// Calculate revenue for an organizer
export const calculateOrganizerRevenue = async (organizerId) => {
  const response = await fetch(`${API_BASE_URL}/wallets/calculate-revenue`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizerId }),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to calculate revenue");
  }

  return data;
};

// Trigger payout for an organizer
export const triggerPayout = async (organizerId, method = "bank_transfer") => {
  const response = await fetch(`${API_BASE_URL}/wallets/trigger-payout`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizerId, method }),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to trigger payout");
  }

  return data;
};

// Get payout history for an organizer
export const getPayoutHistory = async (organizerId, page = 1, limit = 20) => {
  const response = await fetch(
    `${API_BASE_URL}/wallets/payouts/${organizerId}?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: getAuthHeader(),
    },
  );

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch payout history");
  }

  return data;
};

// Verify organizer bank details
export const verifyBankDetails = async (organizerId, verified) => {
  const response = await fetch(
    `${API_BASE_URL}/wallets/${organizerId}/verify-bank`,
    {
      method: "PUT",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verified }),
    },
  );

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to verify bank details");
  }

  return data;
};
