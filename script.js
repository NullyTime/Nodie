/*
    TODO sl;dr
        - fix  node position during save/loading functionality
        - make letter more "in the middle"
        - save as text and load text
        - ability to delete nodes and lines 
        - better UI
        - table with all nodes in there
        - ability to input data by a table
        - page-version of a console
        - lines with numbers
        - window with credits
        - resizable paint window
        - do not allow nodes to go outside of a paint
        - color picker
        - more names for nodes
        - optimize code and delete useless outputs
        - delete line duplicates if it was intentionally connected >1 times
        - make so u can presson the node while drawing a line


*/


//Diameter of the circle
const circleSize = 40;

const defaultLineColor = "orange";
var NODES_Storage = {};

// how many pixels is enough to trigger
var tolerance = 40;

// all lines on the field
var storedLines = [];

// storage for a function to update lines ouside of drawing
var redrawStoredLines;

// flag to delete nodes on the drag
var NODE_DELETION_MODE = false;


function InDepth() {
    function nodeTail(main_node) {
        return (main_node[main_node.length-1]);
    }
    function reverseStr(text) {
        return text.split("").reverse().join("");
    }

    if (Object.keys(NODES_Storage).length == 0) {
        return;
    }

    // clearning after last time
    UnmarkLines();
    for (key in NODES_Storage) {
        NODES_Storage[key].isVisited = false;
    }

    var results = [];
    var buff = "";
    NODES_Storage["A"]["isVisited"] = true;
    var main_node = ["A"];

    var testedNodes = 0;
    var NodesFilled = 1;
    console.log(NODES_Storage)
    var failure = 0;
    while(true) {
        var i = 0;
        while (i<NODES_Storage[nodeTail(main_node)]["Lines"].length) {
            var targetNode = NODES_Storage[nodeTail(main_node)]["Lines"][i];
            if (NODES_Storage[targetNode]["isVisited"] == true) {
                testedNodes += 1;
                i += 1;
                continue;
            }
            NODES_Storage[targetNode]["isVisited"] = true;
            testedNodes = 0;
            NodesFilled += 1;
            buff += main_node[main_node.length-1] + " -> ";
            buff += NODES_Storage[nodeTail(main_node)]["Lines"][i];
            console.log(buff);
            buff = "";

            console.log(main_node);
            results.push(""+main_node[main_node.length-1]+targetNode);
            console.log("results");
            console.log(results);
            main_node.push(NODES_Storage[main_node[main_node.length-1]]["Lines"][i]);
            console.log("found node:" + main_node);
        }
        console.log(nodeTail(main_node));
        if (testedNodes >= NODES_Storage[nodeTail(main_node)]["Lines"].length) {
            console.log("Hit the wall");
            console.log(main_node);
            //results.push("" + main_node[main_node.length-2] + main_node[main_node.length-1]);
            main_node.pop(main_node.length-1);
            console.log(main_node);
            testedNodes = 0;
            i += 1;
        }

        buff = ""
        if (Object.keys(NODES_Storage).length == NodesFilled || main_node.length == 0) {
            var j = 0;
            while (j<main_node.length) {
                //results.push("" + main_node[main_node.length-2] + main_node[main_node.length-1]);
                main_node.splice(main_node.length-1, 1);
                j += 1;
            }
            break;
        }
        failure++;
        if (failure == 9999) {
            console.log("broken");
            return;
        }
    }


    for (var i=0;i<results.length;i++) {
        var line = [];

        //searching mathing
        for (var j=0;j<storedLines.length;j++) {
            if (storedLines[j].nodes == results[i] || reverseStr(storedLines[j].nodes) == results[i]) {
                console.log("fuc");
                storedLines[j].color = "green";
            }  
        }
    }
    redrawStoredLines();
    console.log(results);
    console.log("The end");
}

function inWidth() {
    function reverseStr(text) {
        return text.split("").reverse().join("");
    }
    if (Object.keys(NODES_Storage).length == 0) {
        return;
    }

    // clearning after last time
    UnmarkLines();

    // add flag for visiting a node
    for (key in NODES_Storage) {
        NODES_Storage[key].isVisited = false;
        NODES_Storage[key].isVisited2 = false;
    }

    var nodePath = [];
    nodePath.push("A");
    NODES_Storage["A"].isVisited = true;
    NODES_Storage["A"].isVisited2 = true;

    var connections = [];

    //var mainNodeIndex = 0;
    var safelever = 0;
    while (true) {
        var mainNode = nodePath[nodePath.length-1];
        var connectedNodes = NODES_Storage[mainNode].Lines;
        for (var i=0;i<connectedNodes.length;i++)
        {
            if (NODES_Storage[connectedNodes[i]].isVisited == false) {
                connections.push(""+mainNode+connectedNodes[i]);
                NODES_Storage[connectedNodes[i]].isVisited = true;
            }
        }
        
        // search for visited2
        var flag = false;
        for (var i=0;i<connectedNodes.length;i++) {
            if (NODES_Storage[connectedNodes[i]].isVisited2 == false) {
                NODES_Storage[connectedNodes[i]].isVisited2 = true;
                flag = true;
                nodePath.push(connectedNodes[i]);
                console.log(nodePath);
                break;
            }
        }
        
        //if didn't found, theb shift node path 
        console.log(nodePath);
        if(!flag) {
            console.log("backtracking");
            nodePath.splice(nodePath.length-1, 1);
        }
        
        
        if (nodePath.length == 0) {
            break;
        }
        // safelever++;
        // if(safelever == 20) {
        //     console.log("crashed");
        //     break;
        // }
    }

    console.log(connections);
    for (var i=0;i<connections.length;i++) {
        var line = [];
        
        //searching mathing
        for (var j=0;j<storedLines.length;j++) {
            if (storedLines[j].nodes == connections[i] || reverseStr(storedLines[j].nodes) == connections[i]) {
                console.log("fuc");
                storedLines[j].color = "green";
            }  
        }
    }
    // cleaning trash
    for (key in NODES_Storage) {
        delete NODES_Storage[key].isVisited2
    }
    redrawStoredLines();
    console.log("The end");
}

function aaa() {
    // const canvas = document.querySelector('#paint');
    // const ctx = canvas.getContext('2d');

    // // set line stroke and line width
    // ctx.strokeStyle = 'black';
    // ctx.lineWidth = 5;

    // var node = document.getElementById("A");
    // var a = node.offsetLeft;
    // var b = node.offsetTop;
	
	

    // // draw a red line
    // ctx.beginPath();
    // ctx.moveTo(a+20, b+20);
    // ctx.lineTo(a+20, b+20);
    // ctx.stroke();
    // function data2blob(data, isBase64) {
    //   var chars = "";

    //   if (isBase64)
    //     chars = atob(data);
    //   else
    //     chars = data;

    //   var bytes = new Array(chars.length);
    //   for (var i = 0; i < chars.length; i++) {
    //     bytes[i] = chars.charCodeAt(i);
    //   }

    //   var blob = new Blob([new Uint8Array(bytes)]);
    //   return blob;
    // }


    // var myString = "my string with some stuff";
    // saveAs( data2blob(myString), "myString.txt" );


    function saveFile(fileName,urlFile){
        let a = document.createElement("a");
        a.style = "display: none";
        document.body.appendChild(a);
        a.href = urlFile;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    let textData = `El contenido del archivo
    que sera descargado`;
    let blobData = new Blob([textData], {type: "text/plain"});
    let url = window.URL.createObjectURL(blobData);
    //let url = "pathExample/localFile.png"; // LocalFileDownload
    saveFile('archivo.txt',url);


    return;

    console.log("ye1323s");
    var node = document.getElementById("D");
    var node2 = node.getBoundingClientRect()
    var paint = document.getElementById("paint");
    console.log(node);

    var x = 285;
    var y = 109;
    
    node.style.left = (x-node2.x+25) + "px";
    node.style.top = (y-node2.y+25) + "px";



}

// save button
function saveStateCookie() {
    // need to save: nodes, lines, letters
    var tempNODES_Storage = JSON.parse(JSON.stringify(NODES_Storage));

    // adding location for each node
    for (key in tempNODES_Storage) {
        var node = document.getElementById(key);
        tempNODES_Storage[key].x = node.offsetLeft+20;
        tempNODES_Storage[key].y = node.offsetTop+20;
    }

    document.cookie = JSON.stringify(tempNODES_Storage) + "<--->";
    
    // adding lines
    document.cookie += JSON.stringify(storedLines) + "<--->";

    // adding letters
    var select_letters = document.getElementById("node_names");
    var NODE_Names = [];
    for (var i=0;i<select_letters.length;i++) {
        NODE_Names.push(select_letters[i].value);
    }
    document.cookie += JSON.stringify(NODE_Names);
}

// save button
function saveState() {
    var textData = "";

    // // need to save: nodes, lines, letters
    // var tempNODES_Storage = JSON.parse(JSON.stringify(NODES_Storage));

    // // adding location for each node
    // for (key in tempNODES_Storage) {
    //     var node = document.getElementById(key);
    //     tempNODES_Storage[key].x = node.offsetLeft+20;
    //     tempNODES_Storage[key].y = node.offsetTop+20;
    //     //tempNODES_Storage[key].isVisited = false;
    // }

    // document.cookie = JSON.stringify(tempNODES_Storage) + "<--->";
    
    // // adding lines
    // var tempStoredLines = JSON.parse(JSON.stringify(storedLines));
    // for (var i=0;i<tempStoredLines.length;i++) {
    //     tempStoredLines[i].color = defaultLineColor;
    // }   
    // document.cookie += JSON.stringify(tempStoredLines) + "<--->";

    // // adding letters
    // var select_letters = document.getElementById("node_names");
    // var NODE_Names = [];
    // for (var i=0;i<select_letters.length;i++) {
    //     NODE_Names.push(select_letters[i].value);
    // }
    // document.cookie += JSON.stringify(NODE_Names);




    // need to save: nodes, lines, letters
    var tempNODES_Storage = JSON.parse(JSON.stringify(NODES_Storage));

    // adding location for each node
    for (key in tempNODES_Storage) {
        var node = document.getElementById(key);
        tempNODES_Storage[key].x = node.offsetLeft+20;
        tempNODES_Storage[key].y = node.offsetTop+20;
        //tempNODES_Storage[key].isVisited = false;
    }

    textData += JSON.stringify(tempNODES_Storage) + "<--->";
    
    // adding lines
    var tempStoredLines = JSON.parse(JSON.stringify(storedLines));
    for (var i=0;i<tempStoredLines.length;i++) {
        tempStoredLines[i].color = defaultLineColor;
    }   
    textData += JSON.stringify(tempStoredLines) + "<--->";

    // adding letters
    var select_letters = document.getElementById("node_names");
    var NODE_Names = [];
    for (var i=0;i<select_letters.length;i++) {
        NODE_Names.push(select_letters[i].value);
    }
    textData += JSON.stringify(NODE_Names);

    function saveFile(fileName, urlFile){
        var a = document.createElement("a");
        a.style = "display: none";
        document.body.appendChild(a);
        a.href = urlFile;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    var blobData = new Blob([textData], {type: "text/plain"});
    var url = window.URL.createObjectURL(blobData);
    saveFile('archivo.txt',url);
}


function selectFile (contentType, multiple){
    return new Promise(resolve => {
        let input = document.createElement('input');
        input.type = 'file';
        input.multiple = multiple;
        input.accept = contentType;

        input.onchange = _ => {
            let files = Array.from(input.files);
            if (multiple)
                resolve(files);
            else
                resolve(files[0]);
        };

        input.click();
    });
}



// load button
function loadStateCookie() {
    var decodedCookie = decodeURIComponent(document.cookie).split("<--->");
    console.log(decodedCookie);
    if (decodedCookie.length == 1) {
        console.log("No cookies");
        return;
    }

    // deleting everything
    var placedNodes = document.getElementsByClassName('classNode ui-draggable ui-draggable-handle');
    var parent = document.getElementById('myDiagramDiv');

    // This is a shitty way to fix a bug, but I don't have energy rn
    // TODO fix this bug in a better way 
    while (placedNodes.length != 0) {
        for (var i=0;i<placedNodes.length;i++) {
            parent.removeChild(placedNodes[i]);
        }
        placedNodes = document.getElementsByClassName('classNode ui-draggable ui-draggable-handle');
    }

    
    NODES_Storage = JSON.parse(decodedCookie[0]);
    // add nodes in the field
    for (key in NODES_Storage) {
        makeNode({
            name: key,
            x: NODES_Storage[key].x,
            y: NODES_Storage[key].y
        });


        // THIS CODE IS GARBAGE. FIX LATER
        // TODO
        console.log("yikes");
        var node = document.getElementById(key);
        var node2 = node.getBoundingClientRect();
        var paint = document.getElementById("paint").getBoundingClientRect();

        var x = 285;
        var y = 109;

        node.style.left = (NODES_Storage[key].x-node2.x-20+33) + "px";
        node.style.top = (NODES_Storage[key].y-node2.y-20+220-14-13) + "px";
    }

    // add lines in the field
    storedLines = JSON.parse(decodedCookie[1]);
    redrawStoredLines();

    // update letters list
    LetterManager(3, JSON.parse(decodedCookie[2]));
}



// load button
async function loadState() {

    let files = await selectFile("text/*", true);
    console.log(files);
    



    //var decodedCookie = decodeURIComponent(document.cookie).split("<--->");
    // var decodedCookie;
    // var reader = new FileReaderSync();
    // var result_base64 = reader.readAsDataURL(file); 

    // console.log(result_base64); // aGV5IHRoZXJl..

    // var client = new XMLHttpRequest();
    // client.open('GET', '/foo.txt');
    // client.onreadystatechange = function() {
    //   decodedCookie = client.responseText;
    // }
    // client.send();
    // console.log(decodedCookie);
    // if (decodedCookie.length == 1) {
    //     console.log("No cookies");
    //     return;
    // }

    // deleting everything
    var placedNodes = document.getElementsByClassName('classNode ui-draggable ui-draggable-handle');
    var parent = document.getElementById('myDiagramDiv');

    // This is a shitty way to fix a bug, but I don't have energy rn
    // TODO fix this bug in a better way 
    while (placedNodes.length != 0) {
        for (var i=0;i<placedNodes.length;i++) {
            parent.removeChild(placedNodes[i]);
        }
        placedNodes = document.getElementsByClassName('classNode ui-draggable ui-draggable-handle');
    }

    
    NODES_Storage = JSON.parse(decodedCookie[0]);
    // add nodes in the field
    for (key in NODES_Storage) {
        makeNode({
            name: key,
            x: NODES_Storage[key].x,
            y: NODES_Storage[key].y
        });


        // THIS CODE IS GARBAGE. FIX LATER
        // TODO
        console.log("yikes");
        var node = document.getElementById(key);
        var node2 = node.getBoundingClientRect();
        var paint = document.getElementById("paint");
        console.log(node);
        console.log(paint);

        var x = 285;
        var y = 109;
        
        node.style.left = (NODES_Storage[key].x-node2.x+20-7) + "px";
        node.style.top = (NODES_Storage[key].y-node2.y+170+9) + "px";
    }

    // add lines in the field
    storedLines = JSON.parse(decodedCookie[1]);
    redrawStoredLines();

    // update letters list
    LetterManager(3, JSON.parse(decodedCookie[2]));
}

// Spawn node in the field
function makeNode(save_state) {
    var canvas = document.createElement("canvas");

    canvas.height = circleSize;
    canvas.width = circleSize;
    canvas.style = "border: 1px black;border-radius: 50%;";
    var nodeLetter = document.getElementById("node_names");

    var ctx = canvas.getContext('2d');
    var X = circleSize/2;
    var Y = circleSize/2;

    ctx.beginPath();
    ctx.arc(X, Y, circleSize / 2, 0, 2 * Math.PI, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();

    ctx.fillStyle = "#FF0000";
    ctx.fill(); 

    // Add a letter
    ctx.font = (Math.round(circleSize / 3)+4) + "px serif";
    // TODO make a better letter placement
    ctx.fillStyle = "#000000"; 

    var letter = nodeLetter.options[nodeLetter.selectedIndex].value;
    if (save_state != undefined) {
        letter = save_state.name;
    }

    ctx.fillText(letter, (circleSize / 2)-5, (circleSize / 2)+4);
    canvas.setAttribute("id", letter);
    canvas.setAttribute("class", "classNode");
    document.getElementById("myDiagramDiv").appendChild(canvas);
    $(canvas).draggable({
        drag: function(event, ui) {
            updateLineOnDrag(event, ui);
        }
    });

    // Temporary?
    if (save_state != undefined) {
        console.log("yes");
        var node = document.getElementById(letter);
        console.log(node);
        console.log(save_state);
        node.offsetLeft = save_state.x;
        node.offsetTop = save_state.y;
    } else {
        NODES_Storage[letter] = {
            "isVisited": false,
            "Lines": []
        }
    }
    LetterManager(1, letter);
}

function nodeRemoval(switchMode, event) {
    console.log("234");
    if (switchMode && !NODE_DELETION_MODE) {
        NODE_DELETION_MODE = true;

        //make every node undraggable
        for (key in NODES_Storage) {
            var node = document.getElementById(key);
            $(node).draggable("disable");
        }

        document.getElementById("makeNodders").disabled = true;
        return;
    } else if (switchMode && NODE_DELETION_MODE) {
        NODE_DELETION_MODE = false;

        //make every node undraggable
        for (key in NODES_Storage) {
            var node = document.getElementById(key);
            $(node).draggable("enable");
        }
        document.getElementById("makeNodders").disabled = false;
        return;
    }

    console.log("2sdfsdfdfs");
    var node = document.getElementById(event.target.id);
    var parent = document.getElementById('myDiagramDiv');
    parent.removeChild(node);
}

function updateLineOnDrag(event, ui) {
    if (NODE_DELETION_MODE) {
        nodeRemoval(false, event);
        return;
    }
    console.log(NODE_DELETION_MODE);
    if (NODES_Storage[event.target.id].Lines.length == 0) return;

    // TODO fix this
    // This logic will break when id of nodes will be more than 1 letter
    var flag = false
    for (var i=0;i<storedLines.length;i++) {
        if (storedLines[i].nodes.length == 0) continue;
        for (var j=0;j<storedLines[i].nodes.length;j++) {
            if (storedLines[i].nodes[j] == event.target.id) {
                var node = document.getElementById(event.target.id);
                storedLines[i]["x"+(j+1)] = node.offsetLeft+20;
                storedLines[i]["y"+(j+1)] = node.offsetTop+20;
                flag = true;
            }
        }
    }
    if (flag) {
        redrawStoredLines();
    }
}

function ConnectNodes() {
    // Calculating whenever start and beginning are actually
    // near nodes

    // get all nodes
    var placedNodes = document.getElementById('myDiagramDiv').getElementsByClassName('classNode ui-draggable ui-draggable-handle');

    // find if line is close to two nodes
    // inRadius[0] for a first node
    // inRadius[1] for a second node
    var inRadius = [[],[]];

    for (var i=0;i<placedNodes.length;i++) {
        //ar thisNode = placedNodes.item(i).getBoundingClientRect();
        NodeX = placedNodes.item(i).offsetLeft+20;
        NodeY = placedNodes.item(i).offsetTop+20;

        // Distance between node and a first dot
        var range1 = Math.sqrt(Math.pow(NodeX-storedLines[storedLines.length-1].x1, 2)+Math.pow(NodeY-storedLines[storedLines.length-1].y1, 2));

        // Distance between node and a second dot
        var range2 = Math.sqrt(Math.pow(NodeX-storedLines[storedLines.length-1].x2, 2)+Math.pow(NodeY-storedLines[storedLines.length-1].y2, 2));

        // x, y, node_name, range, first/second dot
        if (range1 < 40) {
            inRadius[0].push([NodeX, NodeY, placedNodes.item(i).id, range1]);
        } else if (range2 < 40) {
            inRadius[1].push([NodeX, NodeY, placedNodes.item(i).id, range2]);
        }
    }

    // find the closest nodes and delete the rest
    // var dot0 = {
    //     "range": inRadius[0]
    // };
    //var dot1Range = dot0Range;  
    for (var i=0;i<inRadius.length;i++) {
        for (var j=0;j<inRadius[i].length;j++) {
            for (var k=j+1;k<inRadius[i].length;k++) {
                if (inRadius[i][j] < inRadius[i][k]) {
                    inRadius[i].splice(k, 1);
                    j--;
                    k--;
                }
            }
        }
    }

    // i really dont like this
    if (inRadius[0].length == 1 && inRadius[1].length == 1) {
        storedLines[storedLines.length-1].x1 = inRadius[0][0][0];
        storedLines[storedLines.length-1].y1 = inRadius[0][0][1];
        storedLines[storedLines.length-1].x2 = inRadius[1][0][0];
        storedLines[storedLines.length-1].y2 = inRadius[1][0][1];
        storedLines[storedLines.length-1].color = defaultLineColor;
        storedLines[storedLines.length-1].nodes = inRadius[0][0][2] + inRadius[1][0][2];
        //storedLines[storedLines.length-1].node2 = inRadius[1][2];

        NODES_Storage[inRadius[1][0][2]]["Lines"].push(inRadius[0][0][2]);
        NODES_Storage[inRadius[0][0][2]]["Lines"].push(inRadius[1][0][2]);

        
    } else {
        // delete a line?
    }

    // updating lines in the end
    redrawStoredLines();
    //console.log(inRadius);
    //console.log(placedNodes);
    //console.log(NODES_Storage);
    //console.log(storedLines);
}


// Handles adding/removing letters from a list
function LetterManager(choice, letter) {
	function insertNames(arr) {
		for (var i = 0; i <= arr.length - 1; i++) {
		    var opt = document.createElement('option');
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
	// 1 = add a node to a list
	// 2 = remove node from a list
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
			break;

        case 3:
            wipeLineHTML();
            insertNames(letter);
            break;
	}
}

// Draws a line between two points
function LinesHandler() {
    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    var sketch = document.querySelector('#myDiagramDiv');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));
    var isDown;
    ctx.strokeStyle = defaultLineColor;
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    $("#paint").mousedown(function(e) {
        handleMouseDown(e);
    });
    $("#paint").mousemove(function(e) {
        handleMouseMove(e);
    });
    $("#paint").mouseup(function(e) {
        handleMouseUp(e);
    });

    $("#clear").click(function() {
        storedLines.length = 0;
        for (key in NODES_Storage) {
            NODES_Storage[key].Lines.length = 0;
        }
        redrawStoredLines();
    });

    function handleMouseDown(e) {
        // ignore line when in special mode
        if(NODE_DELETION_MODE) {
            return;
        }
        var rect = e.target.getBoundingClientRect();
        var mouseX = parseInt(e.clientX - rect.left);
        var mouseY = parseInt(e.clientY - rect.top);

        isDown = true;
        startX = mouseX;
        startY = mouseY;
    }

    function handleMouseMove(e) {
        // ignore line when in special mode
        if(NODE_DELETION_MODE) {
            return;
        }
        if (!isDown) {
            return;
        }
        var rect = e.target.getBoundingClientRect();
        redrawStoredLines();

        var mouseX = parseInt(e.clientX - rect.left);
        var mouseY = parseInt(e.clientY - rect.top);

        // draw the current line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke()
    }

    function handleMouseUp(e) {
        // ignore line when in special mode
        if(NODE_DELETION_MODE) {
            return;
        }
        isDown = false;
        var rect = e.target.getBoundingClientRect();
        var mouseX = parseInt(e.clientX - rect.left);
        var mouseY = parseInt(e.clientY - rect.top);
        storedLines.push({
            x1: startX,
            y1: startY,
            x2: mouseX,
            y2: mouseY,
            color: defaultLineColor
        });
        ConnectNodes();
        redrawStoredLines();
    }

    redrawStoredLines = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (storedLines.length == 0) {
            return;
        }

        // redraw each stored line
        for (var i=0; i<storedLines.length;i++) {
            if (storedLines[i].nodes == undefined) {
                storedLines.splice(i, 1);
                i--;
                continue;
            }
            ctx.strokeStyle = storedLines[i].color;
            ctx.beginPath();
            ctx.moveTo(storedLines[i].x1, storedLines[i].y1);
            ctx.lineTo(storedLines[i].x2, storedLines[i].y2);
            ctx.stroke();
        }
    }
}

function UnmarkLines() {
    for (var i=0;i<storedLines.length;i++) {
        if (storedLines[i].color != defaultLineColor) storedLines[i].color = defaultLineColor;
    }
    redrawStoredLines();
}

document.addEventListener("DOMContentLoaded", function(event) {
    LetterManager(0, null);
    LinesHandler();
});