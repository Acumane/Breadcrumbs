const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

//-----------------------------------------------------------------------------------
// Cache Settings 

// loading
var begin;
startup();
function startup() {
  if (!begin) {
    begin = true;
    switches();
    chrome.storage.sync.get("theme", function(result) {
      preset = result;
      runclick();
    });
  }
}

// storing
var preset;
function store(value) {
  var theme = {"theme": value};
  chrome.storage.sync.set(theme, function() {
});
}

// storing
function runclick() {
  let dest = document.getElementById(preset.theme);
  if (dest) dest.click();
}

function switches() {
  let dest = document.getElementsByClassName("switch");
  for (var i = 0; i < dest.length; i++) {
    dest[i].childNodes[0].defaultChecked = true;
  }
}


// Make the DIV element draggable:
var drag = document.getElementsByClassName("drag");
for(var i = 0; i < drag.length; i++) dragElement(drag[i]);
//-----------------------------------------------------------------------------------
// Settings Panel Config
var st = document.getElementById("setting");
window.addEventListener("keydown",function(e){
    if (e.key === "s")
        st.dispatchEvent(new Event("click"));
});

expand(document.getElementsByClassName("dragpanel"),true);
expand(document.getElementsByClassName("row"),false);

function expand(elmnt,check) {
  for (var i = 0; i < elmnt.length; i++) {
    elmnt[i].addEventListener("click", function() {
        if(check) this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) content.style.maxHeight = null;
        else {
          if (!check) content.style.maxHeight = "150px";
          else content.style.maxHeight = "750px";
        }
    });
  } 
}
//-----------------------------------------------------------------------------------
// Settings drag feature
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var element = document.getElementById(elmnt.id);
  if (document.getElementById(elmnt.id)) 
    elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    var varx = elmnt.offsetLeft - pos1;
    var vary = elmnt.offsetTop - pos2;
    var rect = element.getBoundingClientRect();
    
    if (varx > 0) {
      if (rect.right < viewportWidth || pos1 > 0) elmnt.style.left = varx + "px";
    }
    else elmnt.style.left = "0px";
    if (vary > 0) {
      if (rect.bottom < viewportHeight || pos2 > 0) elmnt.style.top = vary + "px";
    }
    else elmnt.style.top = "-1px";
    
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
//-----------------------------------------------------------------------------------

var mn = document.getElementsByClassName("menu");
for (var i = 0; i < mn.length; i++) {
  if (mn[i].classList.contains("theme") == true) select(mn[i]);
}

function select(menu) {
    var temp = menu.childNodes;
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].nodeName == "BUTTON") {
        temp[i].addEventListener("click", function() {
          var check = false;
          for (var j = 0; j < temp.length; j++) {
            if (i == j) continue;
            if (temp[j].nodeName == "BUTTON") {
              if (temp[j].classList.toggle("select",false) != false) {
                check = true;
              }
            }
          }
          if (!check) { 
            store(this.id);
            this.classList.toggle("select");
        }
        });
      }
    }

}

//-----------------------------------------------------------------------------------
/*
chrome.history.search({
    'text': '',               // Return every history item....
    //'startTime': 604800000,  // that was accessed less than one week ago.
    'maxResults': 50         // Optionally state a limit
},
function(data) {
    // For each history item, get details on all visits.
    // call graph function here:

    //
    for (var i = 0; i < data.length; ++i) {
        var url = data[i].url;
        console.log(url);
        // do whatever you want with this visited url
    }
});*/
