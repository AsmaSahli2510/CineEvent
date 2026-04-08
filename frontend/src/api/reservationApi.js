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

const getAuthHeaders = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    // Try to get from authState
    const authState = localStorage.getItem("authState");
    if (authState) {
      try {
        const parsed = JSON.parse(authState);
        token = parsed.token;
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Fetch user reservations (authenticated)
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise<{reservations: Array, pagination: Object}>}
 */
export const getUserReservations = async (page = 1, limit = 10) => {
  const headers = getAuthHeaders();
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }

  const response = await fetch(
    `${API_BASE_URL}/reservations/my?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers,
    },
  );

  const data = await parseJson(response);

  if (!response.ok) {
    console.error("Reservation API Error:", {
      status: response.status,
      message: data.message,
      data,
    });
    throw new Error(data.message || "Failed to fetch reservations");
  }

  console.log("Reservations fetched successfully:", data);
  return data;
};

/**
 * Fetch organizer's reservations for their events
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @param {string} status - Filter by reservation status (optional)
 * @returns {Promise<{reservations: Array, pagination: Object}>}
 */
export const getOrganizerReservations = async (page = 1, limit = 20, status) => {
  const headers = getAuthHeaders();
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }

  let url = `${API_BASE_URL}/reservations/organizer/events?page=${page}&limit=${limit}`;
  if (status) {
    url += `&status=${status}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const data = await parseJson(response);

  if (!response.ok) {
    console.error("Organizer Reservations API Error:", {
      status: response.status,
      message: data.message,
      data,
    });
    throw new Error(data.message || "Failed to fetch organizer reservations");
  }

  console.log("Organizer reservations fetched successfully:", data);
  return data;
};

/**
 * Create a Stripe payment intent for guest reservation
 * @param {Object} paymentData - Payment data including eventId, selectedSeats, totalAmount, guestInfo
 * @returns {Promise<{clientSecret: string, paymentIntentId: string}>}
 */
export const createPaymentIntent = async (paymentData) => {
  const response = await fetch(`${API_BASE_URL}/reservations/payment/intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to create payment intent");
  }

  return data;
};

/**
 * Confirm guest reservation after successful payment
 * @param {Object} reservationData - Reservation data including guest info and payment details
 * @returns {Promise<{message: string, reservation: Object}>}
 */
export const confirmGuestReservation = async (reservationData) => {
  const response = await fetch(`${API_BASE_URL}/reservations/guest/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reservationData),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data.message || "Failed to confirm reservation");
  }

  return data;
};
