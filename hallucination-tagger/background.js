chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractClaims") {
        console.log("Received highlighted text:", request.text); // Debugging

        // Store the selected text
        chrome.storage.local.set({ selectedText: request.text });

        // Call the API to extract claims
        fetch("http://localhost:5000/extract-claims", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: request.text })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data); // Debugging
            if (data.error) {
                console.error("API Error:", data.error);
                sendResponse({ success: false, message: `Error: ${data.error}` });
            } else {
                chrome.storage.local.set({ extractedClaims: data.claims });
                sendResponse({ success: true, claims: data.claims });
            }
        })
        .catch(error => {
            console.error("Error calling API:", error);
            sendResponse({ success: false, message: `API request failed: ${error.message}` });
        });

        // Open the extension popup
        chrome.action.openPopup();

        return true; // Keeps the message channel open for async response
    }
});
