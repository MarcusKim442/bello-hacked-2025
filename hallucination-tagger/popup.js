function fetch_input(Input_id) {
    let input = document.getElementById(Input_id);
    return input ? input.value.trim() : null;
}

function send_to_tool(text) {
    if (text) {
        chrome.runtime.sendMessage({ action: "extractClaims", text: text }, (response) => {
            console.log("Response from background:", response);
            document.getElementById("outputarea").textContent = response.response || "No claims found.";
        });
    } else {
        alert("Text Not Found");
    }
}

// Load stored claims from `chrome.storage.local`
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get("extractedClaims", (data) => {
        let resultsDiv = document.getElementById("outputarea");
        if (data.extractedClaims) {
            resultsDiv.textContent = data.extractedClaims.join("\n");
        }
    });

    document.getElementById("check").addEventListener("click", () => {
        let input_text = fetch_input("userInput"); 
        send_to_tool(input_text);
    });
});
