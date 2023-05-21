const defaultLineColor = "aqua";


// all lines on the field
var storedLines = [];

// storage for a function to update lines ouside of drawing
var redrawStoredLines;

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


var canvasUpdater;
var lineCtx;

// Draws a line between two points
function LinesHandler() {
	// update canvas on screen resize
	canvasUpdater = function() {
		canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    	canvas.height = parseInt(sketch_style.getPropertyValue('height'));
	}
    var canvas = document.querySelector('#paint');
    lineCtx = canvas.getContext('2d');
    var sketch = document.querySelector('#myDiagramDiv');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));
    var isDown;
    lineCtx.strokeStyle = defaultLineColor;
    lineCtx.lineWidth = 3;
    lineCtx.lineJoin = "round";
    lineCtx.lineCap = "round";

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
        // ignore line when in deletion mode
        if(EDITOR_MODE != 2) {
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
        // ignore line when in deletion mode
        if(EDITOR_MODE != 2) {
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
        lineCtx.lineWidth = document.getElementById("lineWidth").value;
        lineCtx.beginPath();
        lineCtx.moveTo(startX, startY);
        lineCtx.lineTo(mouseX, mouseY);
        lineCtx.stroke()

        if (document.getElementById('scales').checked) {
            lineCtx.font = "14px serif";
            lineCtx.fillStyle = "#FFFFFF"; 

            var letter = document.getElementById("lineCost").value;
            lineCtx.fillText(letter, (startX+mouseX)/2-10, (startY+mouseY)/2-10);
        }
    }

    function handleMouseUp(e) {
        // ignore line when in deletion mode
        if(EDITOR_MODE != 2) {
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
            color: defaultLineColor,
            letter: {
                font: undefined,
                fillStyle: undefined,
                text: undefined
            },
            width: document.getElementById("lineWidth").value
        });

        // copy-paste is a bad practice. but
        if (document.getElementById('scales').checked) {
            storedLines[storedLines.length-1].letter["font"] = "14px serif";
            storedLines[storedLines.length-1].letter["fillStyle"] = "#FFFFFF";
            storedLines[storedLines.length-1].letter["text"] = document.getElementById("lineCost").value;
        }
        ConnectNodes();
        redrawStoredLines();
    }

    redrawStoredLines = function () {
        lineCtx.clearRect(0, 0, canvas.width, canvas.height);
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
            // lines
            lineCtx.strokeStyle = storedLines[i].color;
            lineCtx.lineWidth = storedLines[i].width;
            lineCtx.beginPath();
            lineCtx.moveTo(storedLines[i].x1, storedLines[i].y1);
            lineCtx.lineTo(storedLines[i].x2, storedLines[i].y2);
            lineCtx.stroke();

            // letters
            var x = (storedLines[i].x1+storedLines[i].x2)/2-10;
            var y;
            if (storedLines[i].y1>storedLines[i].y2) {
                var y = (storedLines[i].y1+storedLines[i].y2)/2-10;
            } else {
                var y = (storedLines[i].y1+storedLines[i].y2)/2+20;
            }

            lineCtx.font = storedLines[i].letter.font;
            lineCtx.fillStyle = storedLines[i].letter.fillStyle; 
            lineCtx.fillText(storedLines[i].letter.text, x, y);
        }
    }
}