//-----------------------------------------------------------------------------------
// variables

// saving/loading
var begin, preset;
// Make the DIV element draggable:
var isDrag = false;
var drag = document.getElementsByClassName("drag");
for(var i = 0; i < drag.length; i++) dragElement(drag[i]);
// Settings Panel Config
var st = document.getElementById("setting");
window.addEventListener("keydown",function(e){
if (document.activeElement.nodeName != 'TEXTAREA'
    && document.activeElement.nodeName != 'INPUT'
    && e.key === "s") st.dispatchEvent(new Event("click"));
});
// menu 
var mn = document.getElementsByClassName("menu");
for (var i = 0; i < mn.length; i++) {
  if (mn[i].classList.contains("theme") == true) select(mn[i]);
}
// textbox
var isTextHover = false;
var txt = document.getElementsByClassName("text");
for (var i = 0; i < txt.length; i++) {
  txt[i].addEventListener("mouseleave", function() {isTextHover = false;});
  txt[i].addEventListener("mouseover", function() {isTextHover = true;});
}
// root
var root = document.querySelector(':root');

// viewport
const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
//-----------------------------------------------------------------------------------
// Cache Settings 

// loading
startup();
function startup() {
  if (!begin) {
    begin = true;
    switches();
    chrome.storage.sync.get("theme", function(result) {
      preset = result;
      console.log(result);
      runclick();
      changeTheme(result.theme);

    });
  }
}

// storing
function store(value) {
  var theme = {"theme": value};
  chrome.storage.sync.set(theme, function() {});
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
//-----------------------------------------------------------------------------------

expand(document.getElementsByClassName("dragpanel"),true);
expand(document.getElementsByClassName("row"),false);

function expand(elmnt,check) {
  for (var i = 0; i < elmnt.length; i++) {
    elmnt[i].addEventListener("click", function() {
        if (!isDrag) {
        if(check) this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) content.style.maxHeight = null;
        else {
          if (!check) content.style.maxHeight = "150px";
          else content.style.maxHeight = "750px";
        }
      }
    });
  } 
}
//-----------------------------------------------------------------------------------
// Settings drag feature
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var element = document.getElementById(elmnt.id);
  if (document.getElementById(elmnt.id)) elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    if (!isTextHover) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    }
  }
  function elementDrag(e) {
    isDrag = true;
    resize();
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
  function resize() {
    element.style.transition = "transform 0.15s ease-in-out";
    element.style.transform = "scale(1.04)";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    setTimeout(function(){
      element.style.transform = "scale(1.0)";
      isDrag = false;
      document.onmouseup = null;
      document.onmousemove = null;},10);
  }
}
//-----------------------------------------------------------------------------------

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
            changeTheme(this.id);
        }
        });
      }
    }

}

function changeToDark() {
  root.style.setProperty('--shade', 0.6);
  root.style.setProperty('--shade-hover', 1.0);
  root.style.setProperty('--shade-fade', 0.6);
  root.style.setProperty('--shade-fade-hover', 1.0);
  root.style.setProperty('--primary',"#ed452b");
  root.style.setProperty('--primary-hover',"#f79286");
  root.style.setProperty('--menu-fg',"#2b2b30");
  root.style.setProperty('--menu-bg',"#24233D");
  root.style.setProperty('--textarea-bg',"#171717");
  root.style.setProperty('--canvas',"#202023");
  root.style.setProperty('--submenu-bg',"#121114");
  root.style.setProperty('--switch-bg',"#ccc");
  root.style.setProperty('--header-text', "white");
  root.style.setProperty('--primary-text',"white");
  root.style.setProperty('--secondary-text',"#ccc");
  root.style.setProperty('--secondary-hover', "#3c3a44");
  root.style.setProperty('--scrollbar',"#555");
  root.style.setProperty('--scrollbar-hover',"#888");
  root.style.setProperty('--scrollbar-bg', "#252427");
  root.style.setProperty('--list-bg',"#252427");
  root.style.setProperty('--switch-toggle',"white");
  root.style.setProperty('--watermark',"#ffffff6e");
  root.style.setProperty('--borders',"#494953");
  root.style.setProperty('--shadow',"#191920");
}

function changeToLight() {
  root.style.setProperty('--shade', 1.0);
  root.style.setProperty('--shade-hover', 0.8);
  root.style.setProperty('--shade-fade', 0.8);
  root.style.setProperty('--shade-fade-hover', 1.0);
  root.style.setProperty('--primary', "#eb6056");
  root.style.setProperty('--primary-hover', "#ed452b");
  root.style.setProperty('--menu-fg', "white");
  root.style.setProperty('--menu-bg', "#ab9edb");
  root.style.setProperty('--textarea-bg', "#f5f8fc");
  root.style.setProperty('--canvas', "#f1f3f5"); // done
  root.style.setProperty('--submenu-bg', "#ddd8f1");
  root.style.setProperty('--switch-bg', "#ccc");
  root.style.setProperty('--header-text', "white");
  root.style.setProperty('--primary-text', "black");
  root.style.setProperty('--secondary-text', "black");
  root.style.setProperty('--secondary-hover', "#eeecf8");
  root.style.setProperty('--scrollbar', "#889");
  root.style.setProperty('--scrollbar-hover', "#556");
  root.style.setProperty('--scrollbar-bg', "#ccc");
  root.style.setProperty('--list-bg',"white");
  root.style.setProperty('--switch-toggle', "white");
  root.style.setProperty('--watermark', "#eb6056");
  root.style.setProperty('--borders', "#ccccdd");
  root.style.setProperty('--shadow', "#ccccdd");
}

function changeTheme(id) {
  if (id == "Follow device theme") {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      changeToDark();
    }
    else { changeToLight(); }
  }
  else if (id == "Light") { changeToLight(); }
  else if (id == "Dark") { changeToDark(); }
  else if (id == "Twilight") {
  root.style.setProperty('--shade', 0.6);
  root.style.setProperty('--shade-hover', 1.0);
  root.style.setProperty('--shade-fade', 0.6);
  root.style.setProperty('--shade-fade-hover', 1.0);
  root.style.setProperty('--primary',"#ab9edb"); // D9534F, f2473f
  root.style.setProperty('--primary-hover',"green");
  root.style.setProperty('--menu-fg',"#323558");
  root.style.setProperty('--menu-bg',"#24233D");
  root.style.setProperty('--textarea-bg',"#171717");
  root.style.setProperty('--canvas',"#0c0c15");
  root.style.setProperty('--submenu-bg',"#000000");
  root.style.setProperty('--switch-bg',"#ccc");
  root.style.setProperty('--header-text', "white");
  root.style.setProperty('--primary-text',"#ffffff");
  root.style.setProperty('--secondary-text',"#ccc");
  root.style.setProperty('--secondary-hover', "#3c3a44");
  root.style.setProperty('--scrollbar',"#555");
  root.style.setProperty('--scrollbar-hover',"#888");
  root.style.setProperty('--scrollbar-bg', "#252526");
  root.style.setProperty('--list-bg',"#252526");
  root.style.setProperty('--switch-toggle',"#ffffff");
  root.style.setProperty('--watermark',"#ffffff6e");
  root.style.setProperty('--borders',"#494953");
  root.style.setProperty('--shadow',"#101010");
  }
  else if (id == "Pastel") {
  root.style.setProperty('--shade', 1.0);
  root.style.setProperty('--shade-hover', 0.8);
  root.style.setProperty('--shade-fade', 0.8);
  root.style.setProperty('--shade-fade-hover', 1.0);
  root.style.setProperty('--primary', "#4a5f98");
  root.style.setProperty('--primary-hover',"green");
  root.style.setProperty('--menu-fg', "white");
  root.style.setProperty('--menu-bg', "#ab9edb");
  root.style.setProperty('--textarea-bg', "#f5f8fc");
  root.style.setProperty('--canvas', "#f1f3f5"); // done
  root.style.setProperty('--submenu-bg', "#ddd8f1");
  root.style.setProperty('--switch-bg', "#ccc");
  root.style.setProperty('--header-text', "white");
  root.style.setProperty('--primary-text', "black");
  root.style.setProperty('--secondary-text', "black");
  root.style.setProperty('--secondary-hover', "#eeecf8");
  root.style.setProperty('--scrollbar', "#889");
  root.style.setProperty('--scrollbar-hover', "#556");
  root.style.setProperty('--scrollbar-bg', "#ccc");
  root.style.setProperty('--list-bg',"white");
  root.style.setProperty('--switch-toggle', "white");
  root.style.setProperty('--watermark', "#4a5f98");
  root.style.setProperty('--borders', "#ccccdd");
  root.style.setProperty('--shadow', "#ccccdd");
  }
  else { changeToDark(); }
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
