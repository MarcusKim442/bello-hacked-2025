function send_to_tool(text) {
    if (text) {
        chrome.runtime.sendMessage({ action: "extractClaims", text: text }, (response) => {
            console.log("Response from background:", response);
            let outputArea = document.getElementById("outputarea");

            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
                outputArea.textContent = "Error: Unable to process request.";
                return;
            }

            if (!response || !response.success) {
                outputArea.textContent = response?.message || "Unknown error occurred.";
            } else {
                outputArea.textContent = response.claims && response.claims.length > 0
                    ? response.claims.join("\n")
                    : "No claims found.";
            }
        });
    } else {
        alert("Text Not Found");
    }
}

// Load stored claims when opening the popup
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get("selectedText", (data) => {
        let inputBox = document.getElementById("userInput");
        let searchButton = document.getElementById("check");

        if (data.selectedText) {
            inputBox.value = data.selectedText; // Auto-fill input field
            setTimeout(() => searchButton.click(), 300); // Auto-click search button after slight delay
        }
    });

    document.getElementById("check").addEventListener("click", () => {
        let input_text = document.getElementById("userInput").value.trim();
        send_to_tool(input_text);
    });
});
