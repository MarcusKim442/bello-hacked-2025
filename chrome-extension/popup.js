function fetch_input(Input_id){
    let input = document.getElementById(Input_id);
    if (input){
        return input.value;
    } else {
        console.error("No input Found");
        return null;
    }
}

function send_to_tool(text) {
    if (text){
        chrome.runtime.sendMessage({ action: "sendTextToLLM", text: text }, (response) => {
            console.log("Response from background:", response);
            let capitalizedText = text.toUpperCase(); // capitalizes input text
            document.getElementById("outputarea").textContent = capitalizedText; //change to output later, capitalizedtext placeholder for output
        });
    } 
    else {
        alert("Text Not Found");
    }
}



document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("check");
    button.addEventListener("click", () => {
        let input_text = fetch_input("userInput"); 
        send_to_tool(input_text); 
        
        
    });
    
});


