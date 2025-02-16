function send_to_tool(text) {
    if (text) {
        chrome.runtime.sendMessage({ action: "extractClaims", text: text }, (response) => {
            console.log("Response from background:", response);

            let outputArea = document.getElementById("outputarea");
            if (!response || !response.success) {
                outputArea.textContent = response?.message || "Unknown error occurred.";
            } else {
                outputArea.textContent = response.claims.length > 0 ? response.claims.join("\n") : "No claims found.";
            }
        });
    } else {
        alert("Text Not Found");
    }
}

// Load stored claims when opening the popup
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get("extractedClaims", (data) => {
        let resultsDiv = document.getElementById("outputarea");
        if (data.extractedClaims) {
            resultsDiv.textContent = data.extractedClaims.join("\n");
        }
    });

    document.getElementById("check").addEventListener("click", () => {
        let input_text = document.getElementById("userInput").value.trim();
        send_to_tool(input_text);
    });
});
