import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance for bookings
const bookingClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
bookingClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const bookingAPI = {
  // Check availability and create booking
  checkAndReserve: (bookingData) => {
    return bookingClient.post("/bookings/check-and-reserve", bookingData);
  },

  // Confirm payment after successful transaction
  confirmPayment: (paymentData) => {
    return bookingClient.post("/bookings/confirm-payment", paymentData);
  },

  // Get booking details
  getBooking: (bookingId) => {
    return bookingClient.get(`/bookings/${bookingId}`);
  },

  // Get all bookings for a user
  getUserBookings: (phoneNumber) => {
    return bookingClient.get(`/bookings/user/${phoneNumber}`);
  },

  // Get all pending bookings (admin)
  getAllPendingBookings: () => {
    return bookingClient.get("/bookings");
  },

  // Admin approve booking
  approveBooking: (bookingId) => {
    return bookingClient.put(`/bookings/${bookingId}/approve`);
  },

  // Admin reject booking
  rejectBooking: (bookingId, rejectionReason) => {
    return bookingClient.put(`/bookings/${bookingId}/reject`, {
      rejectionReason,
    });
  },
};

export default bookingAPI;
