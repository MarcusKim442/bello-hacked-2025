import fetch from "node-fetch";

const API_URL = "http://localhost:5000/extract-claims";
const TEST_TEXT = "The Eiffel Tower was built in 1889. Water boils at 100°C. Some people believe the moon landing was faked.";

async function testAPI() {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: TEST_TEXT })
        });

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2)); // Pretty-print response
    } catch (error) {
        console.error("Error calling API:", error);
    }
}

testAPI();
