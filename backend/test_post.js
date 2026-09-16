const fetch = require('node-fetch');

async function testPost() {
  try {
    const response = await fetch("http://localhost:5000/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Staff",
        email: "bhatkeerti473@gmail.com",
        phone: "1234567890",
        password: "EMS@1234",
        role: "Security",
        address: "Test Address",
        status: "Active"
      })
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", data);
  } catch (err) {
    console.error(err);
  }
}

testPost();
