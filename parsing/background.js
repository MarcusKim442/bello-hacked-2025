//RUNS THE WEBPAGE THAT THE VIEWER IS VIEWING AND PUTS TEXT SELECTION TO BACKGROUND.JS
document.addEventListener("mouseup", function () {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 5) {
        // Send the selected text to background.js
        chrome.runtime.sendMessage({ action: "extractClaims", text: selectedText });
    }
});

//CALLS API AND STORES THE EXTRACTED CLAIMS
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractClaims") {
        fetch("http://localhost:5000/extract-claims", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: request.text })
        })
        .then(response => response.json())
        .then(data => {
            chrome.storage.local.set({ extractedClaims: data.claims });
        })
        .catch(error => console.error("Error:", error));
    }
});

