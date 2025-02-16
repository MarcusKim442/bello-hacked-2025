//TEMPORARY, SARANG'S CODE WILL BELONG HERE

document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get("extractedClaims", (data) => {
        let resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "<h3>Extracted Claims:</h3>";
        data.extractedClaims?.forEach(claim => {
            resultsDiv.innerHTML += `<p>${claim}</p>`;
        });
    });
});

