function send_to_tool(text) {
    const container = document.getElementById("claim-card-container");
    const loadingScreen = document.getElementById("loading");
    const outputArea = document.getElementById("outputarea");
    //load banana gif
    container.innerHTML = ""; // clear container pls?
    outputArea.style.display="none";
    loadingScreen.style.display = "flex";
    setTimeout(() => {
        loadingScreen.style.display = "none"; // will hide loading screen after 2.5 seconds?
    }, 2500);

    if (text) {
        chrome.runtime.sendMessage({ action: "extractClaims", text: text }, (response) => {
            console.log("Response from background:", response);
            //let outputArea = document.getElementById("outputarea");

            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
                outputArea.textContent = "Error: Unable to process request.";
                loadingScreen.style.display = "none";
                return;
            }

            if (!response || !response.success) {
                outputArea.textContent = response?.message || "Unknown error occurred.";
                loadingScreen.style.display = "none";
            } else {
                // outputArea.textContent = response.claims && response.claims.length > 0
                //     ? response.claims.join("\n")
                //     : "No claims found.";
                displayClaimLabels(response.claims); 
                loadingScreen.style.display = "none";
            }
        });
    } else {
        alert("Text Not Found");
        loadingScreen.style.display = "none";
        outputArea.style.display = "none";
    }
}

function displayClaimLabels(data) {
    console.log("displayClaimLabels", data)
    try {
        const container = document.getElementById("claim-card-container");
        // const happyBanana = document.getElementById("happybanana");
        // const sadBanana = document.getElementById("sadbanana");
        data.forEach((claim) => {
            // if (claim.truth) {
            //     happyBanana.style.display = "flex";
                

            // } else {
            //     sadBanana.style.display = "flex";

            // }
            // const imageUrl = claim.truth ? "happy-banana.png" : "sad-banana.png";

            container.innerHTML += `
                <div class="card">
                    <h3>"${claim.claim}"</h3>
                    <p>${claim.summary}</p>
                    <a href="${claim.link}">${claim.title}</a>
                    <br>
                    <img src="${claim.truth ? "icons/happybanana.png" : "icons/sadbanana.png"}">
                    <p class="truth-caption ${claim.truth ? "text-green" : "text-red"}">This source ${claim.truth ? "agrees!" : "disagrees..."}</p>
                </div>
            `;
        });

    } catch (error) {
        console.log(error)
    }
}

// Load stored claims when opening the popup
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get("selectedText", (data) => {
        let inputBox = document.getElementById("userInput");
        let searchButton = document.getElementById("check");

        if (data.selectedText) {
            inputBox.value = data.selectedText; // Auto-fill input field
            //setTimeout(() => searchButton.click(), 300); // Auto-click search button after slight delay
        }
    });

    document.getElementById("check").addEventListener("click", () => {
        let input_text = document.getElementById("userInput").value.trim();
        send_to_tool(input_text);
    });
});
