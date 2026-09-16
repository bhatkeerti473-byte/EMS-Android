const API_BASE_URL = "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/api/events`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load events");
  }
  return response.json();
};

export const getVenues = async () => {
  const response = await fetch(`${API_BASE_URL}/api/venues`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load venues");
  }
  const data = await response.json();
  return data.venues || [];
};

export const getVenueById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/venues/${id}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load venue");
  }
  const data = await response.json();
  return data.venue;
};

export const createVenueBooking = async (bookingData) => {
  const response = await fetch(`${API_BASE_URL}/api/venue-bookings/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    throw new Error("Unable to create booking");
  }

  return response.json();
};

export const getBookings = async (userIdOrPhone) => {
  const identifier = userIdOrPhone || "";
  const url = `${API_BASE_URL}/api/bookings/user/${identifier}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load bookings");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.data || [];
};

export const getAllVenueBookings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/venue-bookings`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load venue bookings");
  }
  return response.json();
};

export const updateBookingStatus = async (bookingId, updates) => {
  const response = await fetch(`${API_BASE_URL}/api/venue-bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Unable to update booking status");
  }

  return response.json();
};

export const getUserBilling = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/user/${userId || "guest"}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load billing records");
  }
  return response.json();
};

export const getBillingDashboard = async () => {
  const response = await fetch(`${API_BASE_URL}/api/payments/dashboard`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load billing dashboard");
  }
  return response.json();
};

export const createInvoice = async (bookingId, baseAmount) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/invoices/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ bookingId, baseAmount }),
  });

  if (!response.ok) {
    throw new Error("Unable to generate invoice");
  }

  return response.json();
};

export const createRazorpayOrder = async (invoiceId, paymentAmount, paymentMethod) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/razorpay/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ invoiceId, paymentAmount, paymentMethod }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Unable to create Razorpay order");
  }

  return response.json();
};

export const verifyRazorpayPayment = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/razorpay/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Unable to verify payment");
  }

  return response.json();
};

export const recordCashPayment = async (invoiceId, notes = "", paymentAmount) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/cash`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ invoiceId, notes, paymentAmount }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Unable to record cash payment");
  }

  return response.json();
};

export const getInvoicePdfUrl = (invoiceId) => `${API_BASE_URL}/api/payments/invoices/${invoiceId}/pdf`;

export const submitReview = async (reviewData) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Unable to submit review");
  }

  return response.json();
};

export const uploadReviewImages = async (base64ImagesArray) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews/upload-images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ images: base64ImagesArray }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Unable to upload images");
  }

  return response.json();
};

export const getClientReviews = async () => {
  const response = await fetch(`${API_BASE_URL}/api/reviews/client`, {
    headers: {
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Unable to fetch client reviews");
  }

  return response.json();
};
