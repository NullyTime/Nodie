/*
    TODO sl;dr
        - make letter more "in the middle"
        - save as text and load text
        - ability to delete lines 
        - table with all nodes in there
        - ability to input data by a table
        - page-version of a console
        - window with credits
        - more names for nodes
        - optimize code and delete useless outputs
        - delete line duplicates if it was intentionally connected >1 times
*/

const defaultCircleOutlineColor = '#000000';


var NODES_Storage = {};


function nodeCreationMode(toTerminate) {
	if (toTerminate) {
		$("#globalMouse").unbind("mousemove");
		$("#globalMouse").unbind("mousedown");
		delete canvas;
		delete ctx;
		return;
	}
	// var canvas;
	// if (canvas != undefined) 
	var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

	$("#globalMouse").mousemove(function(e) {
		var paint = document.getElementById("paint").getBoundingClientRect();
		var rect = e.target.parentElement.getBoundingClientRect();
        var mouseX = parseInt(e.clientX);
        var mouseY = parseInt(e.clientY);
        var circleSize = parseInt(document.getElementById("circleSize").value)/2;

		if ((mouseX >= paint.x+circleSize && mouseX <= (paint.x+paint.width-circleSize))
			&& 
			(mouseY >= paint.y+circleSize && mouseY <= (paint.y+paint.height-circleSize))
		) {
			drawNode(e, false, {});
		} else {
			removeNode("ghost");
		}
	});
	$("#globalMouse").mousedown(function(e) {
	    var paint = document.getElementById("paint").getBoundingClientRect();
		var rect = e.target.parentElement.getBoundingClientRect();
        var mouseX = parseInt(e.clientX);
        var mouseY = parseInt(e.clientY);
        var circleSize = parseInt(document.getElementById("circleSize").value)/2;

		if ((mouseX >= paint.x+circleSize && mouseX <= (paint.x+paint.width-circleSize))
			&& 
			(mouseY >= paint.y+circleSize && mouseY <= (paint.y+paint.height-circleSize))
		) {
			drawNode(e, true, {});
		}   
	});

	function getName() {
		var nodeLetter = document.getElementById("node_names");
		return nodeLetter.options[nodeLetter.selectedIndex].value;
	}

	// function deleteGhost() {
	// 	var node document.getElementById(getName());
	// }

    function drawNode(e, pernament, settings) {
        var circleSize = settings.circleSize || document.getElementById("circleSize").value;
        var circleColor = settings.circleColor || document.getElementById("circleColor").value;
        var borderSize = settings.borderSize || document.getElementById("borderSize").value;
        var borderColor = settings.borderColor || document.getElementById("borderColor").value;
        var fontValue = settings.fontSize || getName();
        var fontSize = settings.fontSize || document.getElementById("fontSize").value;
        var fontColor = settings.fontColor || document.getElementById("fontColor").value;

        canvas.style = "border: " + borderSize + "px solid" + borderColor + ";border-radius: 50%;opacity:" + ((pernament)?"100%":"40%");
	    canvas.height = circleSize;
	    canvas.width = circleSize;

	    var X = circleSize/2;
	    var Y = circleSize/2;

	    ctx.beginPath();
	    ctx.arc(X, Y, (circleSize / 2)*0.96, 0, 2 * Math.PI, false);
        ctx.fillStyle = circleColor;
        ctx.fill();
	    ctx.lineWidth = borderSize;
	    ctx.strokeStyle = defaultCircleOutlineColor;
	    ctx.stroke();

	    // Add a letter
	    ctx.font = fontSize + "px serif";
	    // TODO make a better letter placement
	    ctx.fillStyle = fontColor; 

	    ctx.fillText(fontValue, (circleSize / 2)-5, (circleSize / 2)+4);
	    canvas.setAttribute("id", ((pernament)?getName():"ghost"));
	    document.getElementById("myDiagramDiv").appendChild(canvas);
	    
	    var rect = e.target.parentElement.getBoundingClientRect();
        var mouseX = parseInt(e.clientX - rect.left);
        var mouseY = parseInt(e.clientY - rect.top);
	    if (pernament) {
            console.log("df");
            console.log(canvas);
            canvas.style.position = "absolute";
            //canvas.setAttribute("style.z-index", 2);
	    	$(canvas).draggable({
		        drag: function(event, ui) {
		            updateLineOnDrag(event, ui);
		        }
		    });
	    	NODES_Storage[getName()] = {
                "circleSize": circleSize,
                "circleColor": circleColor,
                "borderSize": borderSize,
                "borderColor": borderColor,
                "fontSize": fontSize,
                "fontColor": fontColor,
	            "isVisited": false,
	            "Lines": []
	        }

	        canvas = document.createElement("canvas");
    		ctx = canvas.getContext("2d");

	        var node = document.getElementById(getName());
	        node.style.left = (mouseX-20)+"px";
	        node.style.top = (mouseY-20)+"px";
	        node.style.position = "absolute";
            node.style.zIndex = "20";
	        LetterManager(1, getName());
	    } else {
	    	var node = document.getElementById("ghost");
	        node.style.left = (mouseX-20)+"px";
	        node.style.top = (mouseY-20)+"px";
	        node.style.position = "absolute";
	    }
    }
}


// Spawn node in the field
// function makeNode(save_state) {
//     var canvas = document.createElement("canvas");
//     var circleSize = document.getElementById("circleSize").value;
//     canvas.height = circleSize;
//     canvas.width = circleSize;
//     canvas.style = "border: 1px black;border-radius: 50%;";
//     var nodeLetter = document.getElementById("node_names");

//     var ctx = canvas.getContext('2d');
//     var X = circleSize/2;
//     var Y = circleSize/2;

//     ctx.beginPath();
//     ctx.arc(X, Y, circleSize / 2, 0, 2 * Math.PI, false);
//     ctx.lineWidth = 2;
//     ctx.strokeStyle = defaultCircleOutlineColor;
//     ctx.stroke();

//     ctx.fillStyle = defaultCircleFillColor;
//     ctx.fill(); 

//     // Add a letter
//     ctx.font = (Math.round(circleSize / 3)+4) + "px serif";
//     // TODO make a better letter placement
//     ctx.fillStyle = "#000000"; 

//     var letter = nodeLetter.options[nodeLetter.selectedIndex].value;
//     if (save_state != undefined) {
//         letter = save_state.name;
//     }

//     ctx.fillText(letter, (circleSize / 2)-5, (circleSize / 2)+4);
//     canvas.setAttribute("id", letter);
//     canvas.setAttribute("class", "classNode");
//     // canvas.setAttribute("draggable", true);
//     document.getElementById("myDiagramDiv").appendChild(canvas);
//     $(canvas).draggable({
//         drag: function(event, ui) {
//             updateLineOnDrag(event, ui);
//         }
//     });
//     $(canvas).draggable(true);


//     if (save_state == undefined) {
//         NODES_Storage[letter] = {
//             "isVisited": false,
//             "Lines": []
//         }
//     }

//     LetterManager(1, letter);
// }

function removeNode(nodeID) {
	if (nodeID == "!ALL") {
		var parent = document.getElementById("myDiagramDiv");
		for (key in NODES_Storage) {
			var placedNode = document.getElementById(key);
   			parent.removeChild(placedNode);
		}
		NODES_Storage = {};
		return;
	}

	if (NODES_Storage[nodeID] != undefined) {

	}

	var node = document.getElementById(nodeID);
	if (node != undefined) {
		var parent = document.getElementById('myDiagramDiv');
		parent.removeChild(node);
	}
}

// function nodeRemoval(switchMode, event) {
//     if (switchMode && !NODE_DELETION_MODE) {
//         NODE_DELETION_MODE = true;

//         //make every node undraggable
//         var test = [];
//         for (key in NODES_Storage) {
//             test.push(document.getElementById(key));
//             $(test[test.length-1]).draggable("disable");
//             $(test[test.length-1]).click(function (clicked_node) {
//                 //console.log(clicked_node.target);
//                 var placedNodes = document.getElementById('myDiagramDiv').getElementsByClassName('classNode ui-draggable ui-draggable-handle');
//                 var NodesPosition = [];
//                 console.log(placedNodes);

//                 // saving positions
//                 for (var i=0;i<placedNodes.length;i++) {
//                     if (placedNodes[i].id == clicked_node.target.id) continue;
//                     //var buff = document.getElementById(placedNodes[i].id);
//                     //console.log(buff);
//                     NodesPosition.push([placedNodes[i].id , placedNodes[i].offsetLeft, placedNodes[i].offsetTop]);
//                 }
//                // console.log(NodesPosition);
//                 LetterManager(2, clicked_node.target.id);
//                 var parent = document.getElementById('myDiagramDiv');
//                 parent.removeChild(clicked_node.target);

//                 // recovering old positions
//                 for (var i=0;i<NodesPosition.length;i++) {
//                 	var node = document.getElementById(NodesPosition[i][0]);
// 			        node.style.left = NodesPosition[i][1] + "px";
// 			        node.style.top = NodesPosition[i][2] + "px";
// 			        node.style.position = "absolute";
// 			    }
// 			    console.log(document.getElementById('myDiagramDiv').getElementsByClassName('classNode ui-draggable ui-draggable-handle'));
//             })
//         }

//         document.getElementById("makeNodders").disabled = true;
//         return;
//     } else if (switchMode && NODE_DELETION_MODE) {
//         NODE_DELETION_MODE = false;

//         //make every node undraggable
//         for (key in NODES_Storage) {
//             var node = document.getElementById(key);
//             $(node).draggable("enable");
//         }
//         document.getElementById("makeNodders").disabled = false;
//         return;
//     }
// }



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





document.addEventListener("DOMContentLoaded", function(event) {
    LetterManager(0, null);
    updateDrawingPanel();
    setAutoFontValue();
    defaultColorFields();
});

function updateDrawingPanel() {
	var toolBarSize = document.getElementById("mainTools");

	var drawingWindow = document.getElementById("myDiagramDiv");
	drawingWindow.style.left = (toolBarSize.offsetWidth + 30) + "px";
	drawingWindow.style.width = $(window).width()-40-toolBarSize.offsetWidth + "px";
	drawingWindow.style.top = ($(window).height()*0.01) + "px";
	drawingWindow.style.height = ($(window).height()-$(window).height()*0.01-30) +"px";
	drawingWindow.style.position = "absolute";
	drawingWindow.style["z-index"] = 0;

	var drawingWindow2 = document.getElementById("paint");
	drawingWindow2.style.position = "absolute";
	drawingWindow2.style.width = drawingWindow.style.width;
	drawingWindow2.style.height = ($(window).height()-($(window).height()*0.01)-30) +"px";
	drawingWindow2.style["z-index"] = 1;
	drawingWindow2.style.position = "absolute";

	// TODO fix problem
	// this is workaround 
	if (drawingWindow.style.height != drawingWindow2.style.height) {
		updateDrawingPanel();
		return;
	}
	resizeScreen();
}

window.addEventListener("resize", updateDrawingPanel, true);
