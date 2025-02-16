chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractClaims") {
        console.log("Received text from content.js:", request.text); // Debugging

        fetch("http://localhost:5000/extract-claims", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: request.text })
        })
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data); // Debugging
            chrome.storage.local.set({ extractedClaims: data.claims });
        })
        .catch(error => console.error("Error calling API:", error));
    }
});
