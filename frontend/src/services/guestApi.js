import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const guestClient = axios.create({
  baseURL: API_BASE_URL,
});

guestClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const guestAPI = {
  // Get guest list for an event
  getGuestsForEvent: (eventId) => {
    return guestClient.get(`/guests/event/${eventId}`);
  },

  // Add single guest
  addGuest: (guestData) => {
    return guestClient.post("/guests/create", guestData);
  },

  // Bulk add guests
  bulkAddGuests: (eventId, guests) => {
    return guestClient.post("/guests/bulk", { eventId, guests });
  },

  // Update guest details
  updateGuest: (guestId, updates) => {
    return guestClient.put(`/guests/${guestId}`, updates);
  },

  // Delete guest
  deleteGuest: (guestId) => {
    return guestClient.delete(`/guests/${guestId}`);
  },

  // Send invitations
  sendInvitations: (eventId, guestIds = []) => {
    return guestClient.post("/guests/send-invitations", { eventId, guestIds });
  },

  // Mark attendance (check-in / check-out)
  markAttendance: (guestId, eventId, status) => {
    return guestClient.post("/guests/attendance", { guestId, eventId, status });
  },

  // PUBLIC: Get RSVP details by token
  getRSVPDetails: (token) => {
    return guestClient.get(`/guests/public/rsvp/${token}`);
  },

  // PUBLIC: Submit RSVP answer by token
  submitRSVP: (token, rsvpStatus) => {
    return guestClient.post(`/guests/public/rsvp/${token}`, { rsvpStatus });
  },
};

export default guestAPI;
