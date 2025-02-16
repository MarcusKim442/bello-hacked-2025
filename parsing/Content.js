document.addEventListener("mouseup", function () {
    let selectedText = window.getSelection().toString().trim();
    
    if (selectedText.length > 5) {
        // Send the selected text to background.js
        chrome.runtime.sendMessage({ action: "extractClaims", text: selectedText });
    }
});
