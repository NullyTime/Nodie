// 0 - node moving mode
// 1 - node creation mode
// 2 - line creation mode
// 3 - deletion mode 
var EDITOR_MODE = 2;

function switchFunction() {
	if (EDITOR_MODE == 1) nodeCreationMode(true);
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
		returnButtonsBack();
		return;
	}
	switchFunction();
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
}