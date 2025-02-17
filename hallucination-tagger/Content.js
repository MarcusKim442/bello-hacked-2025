document.addEventListener("mouseup", function () {
    let selectedText = window.getSelection().toString().trim();
    
    if (selectedText.length > 5) {
        console.log("Selected Text:", selectedText); 
        
        // IDK HOW TO CHANGE THIS TO DISPLAY AN IMAGE YET SO THIS IS PLACEHOLDER
        let indicator = document.createElement("div");
        indicator.innerText = "🍌"; 
        indicator.style.position = "absolute";
        indicator.style.background = "#fdfdf1";
        indicator.style.border = "2px solidrgb(209, 219, 156)";
        indicator.style.padding = "5px";
        indicator.style.cursor = "pointer";
        indicator.style.borderRadius = "50%";
        indicator.style.fontSize = "16px";
        indicator.style.boxShadow = "0px 2px 5px rgba(13, 12, 9, 0.2)";
        indicator.style.zIndex = "9999";

        
        let rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        indicator.style.top = `${rect.bottom + window.scrollY + 5}px`;
        indicator.style.left = `${rect.right + window.scrollX + 5}px`;

        document.body.appendChild(indicator);

        // When clicking the indicator -- > send the text to the extension
        indicator.addEventListener("click", function () {
            chrome.runtime.sendMessage({ action: "extractClaims", text: selectedText });
            document.body.removeChild(indicator); // Remove indicator after use
        });

        // Auto-remove indicator after 10 seconds
        setTimeout(() => {
            if (document.body.contains(indicator)) {
                document.body.removeChild(indicator);
            }
        }, 10000);
    }
});
