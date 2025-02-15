console.log("Extension is currently running");

function fetch_input(Input_id){
    let input = document.getElementById(Input_id);
    if (input){
        return input;
    } else {
        console.error("No input Found");
        return null;
    }
}

let input_text = fetch_input(input_id)



