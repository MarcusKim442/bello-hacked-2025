document.addEventListener("mouseup", function () {
    let selectedText = window.getSelection().toString().trim();
    
    if (selectedText.length > 5) {
        console.log("Selected Text:", selectedText); // Debugging
        chrome.runtime.sendMessage({ action: "extractClaims", text: selectedText });
    }
});
