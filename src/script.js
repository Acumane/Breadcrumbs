//-----------------------------------------------------------------------------------
// variables

// saving/loading
// begin is default preset from chrome storage API, preset is local userdata 
// stored on local storage 
var begin, preset;
// Make the DIV element draggable:
// drag elements are mainly the menu's and tab elements 
// in this context.
var isDrag = false;
var drag = document.getElementsByClassName("drag");
// adds drag property to every element in main page
for(var i = 0; i < drag.length; i++) dragElement(drag[i]);
// Settings Panel Config
// id's st = setting, cl = clusters, th = theme, bl = blacklist 
// takes care of settings box and subrows.
// st is settings box elements
var st = document.getElementById("setting");
// cl is clusters tab on settings box
var cl = document.getElementById("Clusters");
// th is themes tab on settings box
var th = document.getElementById("Themes");
// bl is blacklist tab on settings box
var bl = document.getElementById("Blacklist");
// adds keydown event listener for global keybinds.
// this function will parse the active element type by
// node name and check for the dispatch event for
// keydown to click on settings box UI
window.addEventListener("keydown",function(e){
if (document.activeElement.nodeName != 'TEXTAREA'
    && document.activeElement.nodeName != 'INPUT') {
    if (e.key === "s") st.dispatchEvent(new Event("click"));
    
    // check that c/b/t can only be used when box is open 
    // (keys cannot be opened or closed when the box is shut)
    // if press-down has occured then check for each tab individually
    if (st.classList.contains("active")) {
      if (e.key === "c") cl.dispatchEvent(new Event("click"));
      if (e.key === "b") bl.dispatchEvent(new Event("click"));
      if (e.key === "t") th.dispatchEvent(new Event("click"));
      }
    }
});
// mn is menu element
// uses select function on each element of menu (documentation below).
var mn = document.getElementsByClassName("menu");
// checks for if menu contains the theme tag and will select based
// on that for adding function.
for (var i = 0; i < mn.length; i++) {
  if (mn[i].classList.contains("theme") == true) select(mn[i]);
}
// textbox
// manages isTextHover (global boolean for hover over textbox elements).
var isTextHover = false;
var txt = document.getElementsByClassName("text");
// updates text hover for blacklist
for (var i = 0; i < txt.length; i++) {
  // adds functionality for onHover and offHover to mouse inputs
  txt[i].addEventListener("mouseleave", function() {isTextHover = false;});
  txt[i].addEventListener("mouseover", function() {isTextHover = true;});
}
// root = css global variable folder that contains all presets
// root is presets for most document CSS themes
var root = document.querySelector(':root');

// viewport
// base width and height for program that changes with screen change 
// (needs to be refreshed on window size change implement this later?)
const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
//-----------------------------------------------------------------------------------
// Cache Settings 

// loading
// runs on startup of newpage and will cache in previously
// used themes and clusters.
startup();
function startup() {
  // checks only on startup
  if (!begin) {
    begin = true;

    // set switches, get storage and change theme to preset.
    switches();
    // grabs user data from local sync from chrome API
    // and runs changes on newtab when page is launched
    // as well as grabbing user data for graph
    chrome.storage.sync.get("theme", function(result) {
      preset = result;
      runclick();
      changeTheme(result.theme);
    });
  }
}

// storing
// stores our theme data into the chrome storage API.
function store(value) {
  var theme = {"theme": value};
  chrome.storage.sync.set(theme, function() {});
}

// storing
// finds the respective theme element and activates it.
function runclick() {
  // grabs preset theme and "clicks" the UI
  let dest = document.getElementById(preset.theme);
  if (dest) dest.click();
}

// startupt for switches, finds all switches and defaults to active state.
function switches() {
  // checks for elements containing switch to be added and
  // adds defaultCHecked to their childNodes
  let dest = document.getElementsByClassName("switch");
  for (var i = 0; i < dest.length; i++) {
    dest[i].childNodes[0].defaultChecked = true;
  }
}
//-----------------------------------------------------------------------------------
// setup for expand functionality for rows and dragpanel div.
expand(document.getElementsByClassName("dragpanel"),true);
expand(document.getElementsByClassName("row"),false);

// function allows the given element to expand and shrink based off of click
// and keydown event.
function expand(elmnt,check) {
  // for each element add expand functionality
  for (var i = 0; i < elmnt.length; i++) {
    elmnt[i].addEventListener("click", function() {
      // check for dragable element.
        if (!isDrag) {

        // if selected, toggle active
        if(check) {
          // toggles active and determines start and final sizes for UI
          // using maxWidth to manipulate display size of element
          this.classList.toggle("active");
          var par = document.getElementById(this.parentNode.id);
          if (getComputedStyle(par).maxWidth == "150px") par.style.maxWidth = "107.5px";
          else par.style.maxWidth = "150px";
        }
        // resize elements to appropriate size
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
// main dragable elements have dragElement applied to it and keeps track
// of box pos and cursor pos in order to manage dragability.
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  // fetch element and verify that element exists.
  var element = document.getElementById(elmnt.id);
  // adds functionality on mousedown and calls dragmouse function
  if (document.getElementById(elmnt.id)) elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    // if not already dragging settings box
    if (!isTextHover) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    // end behavior
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    }
  }
  function elementDrag(e) {
    isDrag = true;
    // checks for resize
    resize();
    e = e || window.event;
    e.preventDefault();

    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // specify x,y and rect pos on client
    // pre-calculates elements for efficiency
    var varx = elmnt.offsetLeft - pos1;
    var vary = elmnt.offsetTop - pos2;
    var rect = element.getBoundingClientRect();
    
    // check boundaries for collision
    if (varx > 0) { if (rect.right < viewportWidth || pos1 > 0) elmnt.style.left = varx + "px"; }
    else elmnt.style.left = "0px";
    if (vary > 0) { if (rect.bottom < viewportHeight || pos2 > 0) elmnt.style.top = vary + "px"; }
    else elmnt.style.top = "-1px";
    
  }
  function resize() {
    // transform for pickup/drop
    // increases size of box to illustrate visual "pickup and drop"
    element.style.transition = "transform 0.15s ease-in-out";
    element.style.transform = "scale(1.04)";
  }

  function closeDragElement() {
    // stop moving when mouse button is released with delay.
    setTimeout(function(){
      // timeout will allow for transformation time 
      element.style.transform = "scale(1.0)";
      isDrag = false;
      document.onmouseup = null;
      document.onmousemove = null;},10);
  }
}
//-----------------------------------------------------------------------------------
// select takes in a menu div and will add clickable events that check for 
// exclusivity (in other words a group toggleable element list).
function select(menu) {
    var temp = menu.childNodes;
    for (var i = 0; i < temp.length; i++) {
      // error check for button vs other element types.
      if (temp[i].nodeName == "BUTTON") {
        temp[i].addEventListener("click", function() {
          var check = false;
          // check for other elements.
          for (var j = 0; j < temp.length; j++) {

            // check for appropriate button type.
            if (i == j) continue;
            if (temp[j].nodeName == "BUTTON") {
              if (temp[j].classList.toggle("select",false) != false) {
                check = true;
              }
            }
          }
          // if unique, stores id in chrome storage and toggles.
          if (!check) { 
            store(this.id);
            this.classList.toggle("select");
            changeTheme(this.id);
        }
        });
      }
    }

}

// generic dark theme presets.
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
  root.style.setProperty('--submenu-bg',"#111114");
  root.style.setProperty('--switch-bg',"#ccc");
  root.style.setProperty('--header-text', "white");
  root.style.setProperty('--primary-text',"white");
  root.style.setProperty('--secondary-text',"#ccc");
  root.style.setProperty('--secondary-hover', "#3c3a44");
  root.style.setProperty('--scrollbar',"#555");
  root.style.setProperty('--scrollbar-hover',"#888");
  root.style.setProperty('--scrollbar-bg', "#252526");
  root.style.setProperty('--list-bg',"#252526");
  root.style.setProperty('--switch-toggle',"white");
  root.style.setProperty('--watermark',"#ffffff6e");
  root.style.setProperty('--borders',"#494953");
  root.style.setProperty('--shadow',"#191920");
}
// generic light theme presets.
function changeToLight() {
  root.style.setProperty('--shade', 1.0);
  root.style.setProperty('--shade-hover', 0.8);
  root.style.setProperty('--shade-fade', 0.8);
  root.style.setProperty('--shade-fade-hover', 1.0);
  root.style.setProperty('--primary', "#eb6056");
  root.style.setProperty('--primary-hover',"red");
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
// changeTheme will manage all theme switches from the Themes menu dropdown.
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
  else if (id == "Arctic") {
    root.style.setProperty('--shade', 0.6);
    root.style.setProperty('--shade-hover', 1.0);
    root.style.setProperty('--shade-fade', 0.6);
    root.style.setProperty('--shade-fade-hover', 1.0);
    root.style.setProperty('--primary',"#819ac1");
    root.style.setProperty('--primary-hover',"#bce");
    root.style.setProperty('--menu-fg',"#2e3440");
    root.style.setProperty('--menu-bg',"#383a59");
    root.style.setProperty('--textarea-bg',"#1c1e26");
    root.style.setProperty('--canvas',"#191a1f");
    root.style.setProperty('--submenu-bg',"#22262f");
    root.style.setProperty('--switch-bg',"#d8dee9");
    root.style.setProperty('--header-text', "#22262f");
    root.style.setProperty('--primary-text',"#d8dee9");
    root.style.setProperty('--secondary-text',"#d8dee9");
    root.style.setProperty('--secondary-hover', "#3b4252");
    root.style.setProperty('--scrollbar',"#434c5e");
    root.style.setProperty('--scrollbar-hover',"#678");
    root.style.setProperty('--scrollbar-bg', "#1c1e26");
    root.style.setProperty('--list-bg',"#2e3440");
    root.style.setProperty('--switch-toggle',"#d8dee9");
    root.style.setProperty('--watermark',"#ffffff6e");
    root.style.setProperty('--borders',"#484a53");
    root.style.setProperty('--shadow',"#14161a");
  }
  else { changeToDark(); }
}