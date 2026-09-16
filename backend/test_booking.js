const axios = require("axios");

async function testBooking() {
  try {
    const response = await axios.post("http://localhost:5000/api/bookings/check-and-reserve", {
        client_id: "CLIENT_123",
        phone_number: "9876543210",
        userId: "testuser",
        clientName: "Test Name",
        clientEmail: "test@example.com",
        address: "Test Address",
        event_type: "Test Event",
        eventTitle: "Test Event",
        event_date: "2026-07-25",
        time_slot: "Full Day",
        venue_id: "1",
        venueName: "Palace Garden Estate",
        catering_details: {
            type: "1",
            guest_count: 100,
        },
        staff_requirements: {},
        total_cost: 50000,
        image: "test.jpg"
    });
    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
  }
}

testBooking();
