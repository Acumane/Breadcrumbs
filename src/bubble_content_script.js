

var startBubble;
chrome.storage.local.get("bubble_bool",function(result) {
    startBubble = result;
});

window.addEventListener("keydown",function(e){
    if (e.key === "b") {
        if (startBubble) startBubble = false;
        else startBubble = true;
        if (startBubble) {
            console.log(window.location.href);
        }
        chrome.storage.local.set({"bubble_bool":startBubble},function(){});
    }  
});


