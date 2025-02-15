chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
    if (request.action === "sendTextToLLM") {
        const userText = request.Text;
        //for LLM API stuff 
        //call API response
        setTimeout(() => {
            //here use API i think
            sendResponse({status:"success"});
        }, 1000); //1 second 
    }
})