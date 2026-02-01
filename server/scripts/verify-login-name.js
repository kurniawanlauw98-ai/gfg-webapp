const axios = require('axios');

const API_URL = 'http://localhost:5000';

const verify = async () => {
    try {
        // 1. Register a fresh user
        const uniqueId = Date.now();
        const testUser = {
            name: `NamedUser_${uniqueId}`,
            email: `named_${uniqueId}@example.com`,
            password: "password123",
            dob: "2000-01-01",
            hobby: "Testing",
            favoriteVerse: "Psalm 23"
        };

        console.log("1. Registering:", testUser.name);
        await axios.post(`${API_URL}/api/auth/register`, testUser);
        console.log("   Registration OK.");

        // 2. Login using NAME
        console.log("2. Attempting login with NAME:", testUser.name);

        const loginData = {
            email: testUser.name, // Sending Name in email field
            password: "password123"
        };

        const res = await axios.post(`${API_URL}/api/auth/login`, loginData);

        if (res.data.token) {
            console.log("SUCCESS: Logged in with NAME.");
            console.log("Token received.");
        } else {
            console.log("FAILED: No token.");
        }

    } catch (error) {
        if (error.response) {
            console.log("FAILED: Server responded with error.");
            console.log("Data:", error.response.data);
        } else {
            console.log("FAILED:", error.message);
        }
    }
};

verify();
