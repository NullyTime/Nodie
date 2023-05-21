// 0 - node moving mode
// 1 - node creation mode
// 2 - line creation mode
// 3 - deletion mode 
var EDITOR_MODE = 0;


function changeDraggable(change) {
    for (key in NODES_Storage) {
        var node = document.getElementById(key);
        $(node).draggable(change);
    }

    // make paint panel the closest to viewer
    var zIndex = parseInt(document.getElementById("paint")["style"]["z-index"]);
    if (change == "disable") {
        document.getElementById("paint")["style"]["z-index"] = zIndex+9999;
    } else {
        document.getElementById("paint")["style"]["z-index"] = zIndex-9999;
    }
}

function switchFunction() {
	if (EDITOR_MODE == 1) nodeCreationMode(true);
    else if (EDITOR_MODE == 2) changeDraggable("enable");
}

function NodeMode() {
	if (EDITOR_MODE == 1) {
		EDITOR_MODE = 0;
		returnButtonsBack();
		nodeCreationMode(true);
		return;
	}
	switchFunction();
	returnButtonsBack();
	EDITOR_MODE = 1;
	var button = document.getElementById("button1");
	//button.style["border-style"] = "dotted";
	button.style["background-color"] = "#1d2450";
	nodeCreationMode(false);
}

function LineMode() {
	if (EDITOR_MODE == 2) {
		EDITOR_MODE = 0;
        changeDraggable("enable");
		returnButtonsBack();
        LinesHandler(true);
		return;
	}
    // clear other functions
    switchFunction();

    // make every node not changable 
    changeDraggable("disable");
    LinesHandler();
	returnButtonsBack();
	EDITOR_MODE = 2;
	var button = document.getElementById("button2");
	//button.style["border-style"] = "dotted";
	button.style["background-color"] = "#1d2450";
}

function DeleteMode() {
	if (EDITOR_MODE == 3) {
		EDITOR_MODE = 0;
		returnButtonsBack();
		return;
	}
    switchFunction();
	returnButtonsBack();
	EDITOR_MODE = 3;
	var button = document.getElementById("button3");
	//button.style["border-style"] = "dotted";
	button.style["background-color"] = "#1d2450";
}


function returnButtonsBack() {
	for (var i=1;i<4;i++) {
		var button = document.getElementById("button"+i);
		button.style["border-style"] = "";
		button.style["background-color"] = "";
	}
}


function setAutoFontValue() {
    var button = document.getElementById("autoFont");
    if (button.value == "Manual Font Size Mode") return;
    var circleSize = document.getElementById("circleSize");
    var fontSize = document.getElementById("fontSize");
    fontSize.value = (Math.round(circleSize.value / 3)+4);
    fontSize.disabled = true;
}
function autoFontGenerator() {
    var button = document.getElementById("autoFont");
    var fontSize = document.getElementById("fontSize");
    if (button.value == "Auto Font Size Mode") {
        button.value = "Manual Font Size Mode";
        button.style["background-color"] = "#1d2450";
        fontSize.disabled = false;
    } else {
        button.value = "Auto Font Size Mode";
        button.style["background-color"] = "#9da6dc";
        setAutoFontValue();
    }

}

// No Cost Mode button handler
function noCostTooGreat() {
    var button = document.getElementById("lineCostButton");
    var cost = document.getElementById("lineCost");
    cost.disabled = !cost.disabled;
    if (cost.disabled) {
        button.value = "No Cost Mode";
    } else {
        button.value = "Pricy Mode";
    }
}

// to set up colors on start
function defaultColorFields() {
    var defaults = {
        "circleColor": "#FD1385",
        "fontColor": "#000000",
        "borderColor": "#000000",
        "lineColor": "#23C1FF"
    }
    for (key in defaults) {
        var panel = document.getElementById(key);
        panel.value = defaults[key];
    }

    // update pen for a line
    resizeScreen();
}


// Handles adding/removing letters from a list
function LetterManager(choice, letter) {
    function insertNames(arr) {
        for (var i = 0; i <= arr.length - 1; i++) {
            var opt = document.createElement("option");
            opt.value = arr[i];
            opt.innerHTML = arr[i];
            select.appendChild(opt);
        }
    }
    function wipeLineHTML() {
        for (var i=0;i<select.length;i++) {
            select.remove(i);
            i--;
        }
    }
    // 0 = add all letters
    // 1 = remove a node from list
    // 2 = add node to a list
    // 3 = "load" functionality

    var select = document.getElementById("node_names");
    switch(choice) {
        case 0:
            var NODE_Names = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('');
            insertNames(NODE_Names);
            break;

        case 1:
            var NODE_Names = [];
            for (var i=0;i<select.length;i++) {
                NODE_Names.push(select[i].value);
            }

            wipeLineHTML();
            NODE_Names.splice(NODE_Names.indexOf(letter), 1);
            insertNames(NODE_Names);

            if (select.length == 0) {
                var button = document.getElementById("makeNodders");
                button.setAttribute("disabled", "disabled");
            }
            break;

        case 2:
            var NODE_Names = [];
            for (var i=0;i<select.length;i++) {
                NODE_Names.push(select[i].value);
            }

            wipeLineHTML();
            NODE_Names.push(letter);
            NODE_Names.sort();
            insertNames(NODE_Names);
            break;

        case 3:
            wipeLineHTML();
            insertNames(letter);
            break;
    }
}

// change input bars according to amount of numbers
function changeInputLength(inputPlace) {
	var elem = document.getElementById(inputPlace);
	elem.size = ((elem.value.length <= 10)?elem.value.length+2:elem.size);

    if (inputPlace == "circleSize") {
        setAutoFontValue();
    }
}