import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
apiClient.interceptors.request.use(
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

// Event API calls
const eventAPI = {
  // Create a new event
  createEvent: (eventData) => {
    return apiClient.post("/events/create", eventData);
  },

  // Get all user events
  getUserEvents: () => {
    return apiClient.get("/events/user-events");
  },

  // Get single event with details
  getEventDetails: (eventId) => {
    return apiClient.get(`/events/${eventId}`);
  },

  // Update event
  updateEvent: (eventId, updates) => {
    return apiClient.put(`/events/${eventId}`, updates);
  },

  // Delete event
  deleteEvent: (eventId) => {
    return apiClient.delete(`/events/${eventId}`);
  },

  // Save event schedule
  saveEventSchedule: (scheduleData) => {
    return apiClient.post("/events/schedule/save", scheduleData);
  },

  // Add event resource
  addEventResource: (resourceData) => {
    return apiClient.post("/events/resource/add", resourceData);
  },

  // Update event resource
  updateEventResource: (resourceId, updates) => {
    return apiClient.put(`/events/resource/${resourceId}`, updates);
  },

  // Delete event resource
  deleteEventResource: (resourceId) => {
    return apiClient.delete(`/events/resource/${resourceId}`);
  },

  // Get event statistics
  getEventStats: () => {
    return apiClient.get("/events/stats/overview");
  },
};

export default eventAPI;
