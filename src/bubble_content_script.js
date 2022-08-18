

var startBubble;
chrome.storage.local.get("bubble_bool",function(result) {
    startBubble = result;
});

window.addEventListener("keydown",function(e){
    if (e.key === "b") {

        chrome.windows.create({url: "https://www.google.com/", type: "popup"});

        chrome.storage.local.set({"bubble_bool":startBubble},function(){});
    }  
});

console.log(window.location.href);


