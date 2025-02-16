function send_to_tool(text) {
    if (text) {
        chrome.runtime.sendMessage({ action: "extractClaims", text: text }, (response) => {
            console.log("Response from background:", response);
            
            if (!response || !response.success) {
                document.getElementById("outputarea").textContent = response?.message || "Unknown error occurred.";
            } else {
                document.getElementById("outputarea").textContent = response.claims.length > 0 ? response.claims.join("\n") : "No claims found.";
            }
        });
    } else {
        alert("Text Not Found");
    }
}
