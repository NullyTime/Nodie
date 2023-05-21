// To make nodes on a different levels
var globalZInndex = 19;

// main storage for node information
var NODES_Storage = {};


function nodeCreationMode(toTerminate, preBuilt) {
	// to switch mode
	if (toTerminate) {
		$("#globalMouse").unbind("mousemove");
		$("#globalMouse").unbind("mousedown");
		delete canvas;
		delete ctx;
		return;
	}

	var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    // create prebuilt node
    if (preBuilt != undefined) {
        drawNode(undefined, true, preBuilt);
        return;
    } 

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
			drawNode(e, false);
		} else {
			removeNode({id: "ghost"});
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
			drawNode(e, true);
		}   
	});

	function getName() {
		var nodeLetter = document.getElementById("node_names");
		return nodeLetter.options[nodeLetter.selectedIndex].value;
	}

    function drawNode(e, pernament, recover) {
        var nodeName;
        var circleSize;
        var circleColor;
        var borderSize;
        var borderColor;
        var fontSize; 
        var fontColor;
        var connections = [];
        if (recover != undefined) {
            nodeName = recover.nodeName;
            circleSize = recover.settings.circleSize;
            circleColor = recover.settings.circleColor;
            borderSize = recover.settings.borderSize;
            borderColor = recover.settings.borderColor;
            fontSize = recover.settings.fontSize;
            fontColor = recover.settings.fontColor;
            connections = recover.Lines.slice(0);
        } else {
        	nodeName = getName();
            circleSize = document.getElementById("circleSize").value;
            circleColor = document.getElementById("circleColor").value;
            borderSize = document.getElementById("borderSize").value;
            borderColor = document.getElementById("borderColor").value;
            fontSize = document.getElementById("fontSize").value;
            fontColor = document.getElementById("fontColor").value;
        }

        canvas.style = "border: " + borderSize + "px solid" + borderColor + ";border-radius: 50%;opacity:" + ((pernament)?"100%":"40%");
	    canvas.height = circleSize;
	    canvas.width = circleSize;

	    var X = circleSize/2;
	    var Y = circleSize/2;

	    ctx.beginPath();
	    ctx.arc(X, Y, (circleSize / 2), 0, 2 * Math.PI, false);
        ctx.fillStyle = circleColor;
        ctx.fill();
	    ctx.lineWidth = borderSize;
	    ctx.strokeStyle = defaultCircleOutlineColor;

	    // Add a letter
	    ctx.font = fontSize + "px serif";
	    // TODO make a better letter placement
	    ctx.fillStyle = fontColor; 

	    ctx.fillText(nodeName, (circleSize / 2)-5, (circleSize / 2)+4);
	    canvas.setAttribute("id", ((pernament)?nodeName:"ghost"));
	    document.getElementById("myDiagramDiv").appendChild(canvas);
	    
	    
        var mouseX;
        var mouseY;
        if (e != undefined) {
            var rect = e.target.parentElement.getBoundingClientRect();
            mouseX = parseInt(e.clientX - rect.left);
            mouseY = parseInt(e.clientY - rect.top);
        } else {
            mouseX = recover.settings.x;
            mouseY = recover.settings.y;
        }

	    if (pernament) {
	    	globalZInndex++;
            //console.log("df");
            //console.log(canvas);
            canvas.style.position = "absolute";
            //canvas.setAttribute("style.z-index", 2);
	    	$(canvas).draggable({
		        drag: function(event, ui) {
		            updateLineOnDrag(event, ui);
		            
		            // later
		            //borderRestriction(event, ui);
		        },
		        start: function(event, ui) {
		        	// place for animations

		        	//console.log(ui.helper[0].style)
		        	//ui.helper[0].style
		        	//ui.helper[0].s
		        },
		        stop: function(event, ui) {
		        	// place for animations

		        	//ui.helper[0].removeClass("draggedNode");
		        }
		    });
		    NODES_Storage[nodeName] = {
		    	"settings": {},
		    	"isVisited": false,
	            "Lines": connections.slice(0),
	            "LinesV2": []
	        }
	    	NODES_Storage[nodeName].settings = {
                "circleSize": circleSize,
                "circleColor": circleColor,
                "borderSize": borderSize,
                "borderColor": borderColor,
                "fontSize": fontSize,
                "fontColor": fontColor,
                "zIndex": globalZInndex
	        }

	        canvas = document.createElement("canvas");
    		ctx = canvas.getContext("2d");

	        var node = document.getElementById(nodeName);
	        node.style.left = (mouseX-20)+"px";
	        node.style.top = (mouseY-20)+"px";
	        node.style.position = "absolute";
            node.style.zIndex = globalZInndex;
	        // remove letter from list
	        LetterManager(1, nodeName);

	        // update list in Tasks
	        updateTasksCrown();
	    } else {
	    	var node = document.getElementById("ghost");
	        node.style.left = (mouseX-20)+"px";
	        node.style.top = (mouseY-20)+"px";
	        node.style.position = "absolute";
	        node.style.zIndex = "21";
	    }
    }
}

function borderRestriction(event, ui) {
	// console.log(event.target);
	// var node = document.getElementById(event.target.id);
	// var panel = document.getElementById("paint");

	// if (node.offsetLeft+NODES_Storage[event.target.id].settings.circleSize/2 ||
	// 	)

	//console.log(ui);
	//return;
	var paint = document.getElementById("paint").getBoundingClientRect();
	var rect = event.target.parentElement.getBoundingClientRect();
    var nodeX = parseInt(event.clientX);
    var nodeY = parseInt(event.clientY);
    var circleSize = NODES_Storage[event.target.id].settings.circleSize/2;

	if (nodeX < paint.x+circleSize || nodeX > (paint.x+paint.width-circleSize)) {
		setTimeout(function(){
			var node = document.getElementById(event.target.id);
			console.log(node);
			node.style.left = "100px";
			node.style.position = "absolute";
	        node.style.zIndex = globalZInndex;
		}, 3000);
		console.log(event.target.style);
		//event.target.style.left = +"px";
		var node = document.getElementById(event.target.id);
		console.log(node);
		node.style.left = "100px";
		node.style.position = "absolute";
        node.style.zIndex = globalZInndex;
	} else if (nodeY < paint.y+circleSize || nodeY > (paint.y+paint.height-circleSize)) {
		//event.target.style.top = 1+"px";
		var node = document.getElementById(event.target.id);
		node.style.top = "1px";
	}
}

function removeNode(node) {
	// it's easier to delete ghost here and now
	if (node.id == "ghost") {
		var node = document.getElementById(node.id);
		if (node != undefined) {
			var parent = document.getElementById("myDiagramDiv");
			parent.removeChild(node);
		}
		return;
	}
	if (node == "!ALL") {
		var parent = document.getElementById("myDiagramDiv");
		for (key in NODES_Storage) {
			var placedNode = document.getElementById(key);
   			parent.removeChild(placedNode);
		}
		NODES_Storage = {};
		return;
	}

	
	// delete lines
	for (var i=0;i<NODES_Storage[node.id].LinesV2.length;i++) {
		removeLine(NODES_Storage[node.id].LinesV2[i]);
	}
	


	var node = document.getElementById(node.id);
	if (node != undefined) {
		var parent = document.getElementById("myDiagramDiv");
		parent.removeChild(node);
	}
	LetterManager(2, node.id);

	delete NODES_Storage[node.id];
}

function ConnectNodes() {
    // Calculating whenever start and beginning are actually near nodes

    var matches = [];
    // make copy of last line for a simplification
    var lastLine = JSON.parse(JSON.stringify(storedLines[storedLines.length-1]));
    // calculate all possible ranges
    for (key in NODES_Storage) {
        var node = document.getElementById(key);
        var nodeX = node.offsetLeft + (NODES_Storage[key].settings.circleSize/2);
        var nodeY = node.offsetTop + (NODES_Storage[key].settings.circleSize/2);

        var range = Math.sqrt(Math.pow(nodeX-lastLine.x1, 2)+Math.pow(nodeY-lastLine.y1, 2));
        matches.push([0, range, key, nodeX, nodeY]);
        range = Math.sqrt(Math.pow(nodeX-lastLine.x2, 2)+Math.pow(nodeY-lastLine.y2, 2));
        matches.push([1, range, key, nodeX, nodeY]);
        
    }

    //console.log(matches);

    var finalDots = [[0, 9999999],[1, 9999999]];

    for (var i=0;i<matches.length;i++) {
        if (matches[i][1] < finalDots[matches[i][0]][1] && matches[i][1]<NODES_Storage[matches[i][2]].settings.circleSize) {
            finalDots[matches[i][0]] = JSON.parse(JSON.stringify(matches[i]));
        }
    }

    //console.log(finalDots)

    // if one or two ends didn't found closest point
    if (finalDots[0][1] == 9999999 || finalDots[1][1] == 9999999 
        || finalDots[0][2] == finalDots[1][2]) {
        return;
    }

    storedLines[storedLines.length-1].id = 0+Date.now();
    storedLines[storedLines.length-1].x1 = finalDots[0][3];
    storedLines[storedLines.length-1].y1 = finalDots[0][4];
    storedLines[storedLines.length-1].x2 = finalDots[1][3];
    storedLines[storedLines.length-1].y2 = finalDots[1][4];
    storedLines[storedLines.length-1].color = lastLine.color;
    storedLines[storedLines.length-1].nodes = finalDots[0][2] + finalDots[1][2];
    //storedLines[storedLines.length-1].node2 = inRadius[1][2];

    NODES_Storage[finalDots[0][2]]["Lines"].push(finalDots[1][2]);
    NODES_Storage[finalDots[1][2]]["Lines"].push(finalDots[0][2]);

    NODES_Storage[finalDots[0][2]]["LinesV2"].push(storedLines[storedLines.length-1].id);
    NODES_Storage[finalDots[1][2]]["LinesV2"].push(storedLines[storedLines.length-1].id);

    console.log(NODES_Storage);
    console.log(storedLines);
    // updating lines in the end
    redrawStoredLines();
}





document.addEventListener("DOMContentLoaded", function(event) {
    LetterManager(0, null);
    updateDrawingPanel();
    setAutoFontValue();
    defaultColorFields();

    // this is shitty workaround for a bad design, but it works
    // it makes redrawStoredLines() fucntion
    LinesHandler();
    LinesHandler(true);
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
