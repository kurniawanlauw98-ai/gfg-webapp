const axios = require('axios');

const API_URL = 'http://localhost:5000';

const verify = async () => {
    try {
        const testUser = {
            name: "Test User 001",
            email: `testuser001_${Date.now()}@example.com`, // Unique email
            password: "password123",
            dob: "2000-01-01",
            hobby: "Coding",
            favoriteVerse: "John 3:16"
        };

        console.log("Attempting register with:", testUser);

        const res = await axios.post(`${API_URL}/api/auth/register`, testUser);

        console.log("Registration Status:", res.status);
        console.log("Response Data:", res.data);

        if (res.status === 201) {
            console.log("SUCCESS: User registered.");

            // Try Login
            console.log("Attempting login...");
            const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });

            if (loginRes.data.token) {
                console.log("SUCCESS: User logged in.");
                console.log("Login Token:", loginRes.data.token);
            } else {
                console.log("FAILED: Login response missing token.");
            }
        } else {
            console.log("FAILED: Unexpected status.");
        }

    } catch (error) {
        if (error.response) {
            console.log("FAILED: Server responded with error.");
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data);
        } else if (error.request) {
            console.log("FAILED: No response received. Is the server running?");
        } else {
            console.log("FAILED: Error setting up request:", error.message);
        }
    }
};

verify();
