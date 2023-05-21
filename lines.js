// all lines on the field
var storedLines = [];

// storage for a function to update lines ouside of drawing
var redrawStoredLines;

function updateLineOnDrag(event, ui) {
    // if (NODE_DELETION_MODE) {
    //     nodeRemoval(false, event);
    //     return;
    // }
    //console.log(NODE_DELETION_MODE);
    //console.log(NODES_Storage[event.target.id]);
    if (NODES_Storage[event.target.id] == 0) return;
    if (NODES_Storage[event.target.id].Lines.length == 0) return;

    // TODO fix this
    // This logic will break when id of nodes will be more than 1 letter
    var flag = false
    for (var i=0;i<storedLines.length;i++) {
        if (storedLines[i].nodes.length == 0) continue;
        for (var j=0;j<storedLines[i].nodes.length;j++) {
            if (storedLines[i].nodes[j] == event.target.id) {
                var node = document.getElementById(event.target.id);
                storedLines[i]["x"+(j+1)] = node.offsetLeft+NODES_Storage[event.target.id].settings.circleSize/2;
                storedLines[i]["y"+(j+1)] = node.offsetTop+NODES_Storage[event.target.id].settings.circleSize/2;
                flag = true;
            }
        }
    }
    if (flag) {
        redrawStoredLines();
    }
}

function removeLine(lineID) {
    for (var i=0;i<storedLines.length;i++) {
        if (storedLines[i].id == lineID) {
            storedLines.splice(i, 1);
            redrawStoredLines();
            return;
        }
    }
}

// Draws a line between two points
var resizeScreen = function(){};
function LinesHandler(toTerminate) {
    if (toTerminate) {
        $("#globalMouse").unbind("mousemove");
        $("#globalMouse").unbind("mousedown");
        $("#globalMouse").unbind("mouseup");
        $("#globalMouse").unbind("click");
        delete canvas;
        delete lineCtx;
        return;
    }
    var canvas = document.querySelector("#paint");
    var lineCtx = canvas.getContext("2d");
    var isDown;
    var startX;
    var startY;

    function isInsideBox(e) {
        var paint = document.getElementById("paint").getBoundingClientRect();
        var rect = e.target.parentElement.getBoundingClientRect();
        var mouseX = parseInt(e.clientX);
        var mouseY = parseInt(e.clientY);
        return (
        (mouseX >= paint.x && mouseX <= paint.x+paint.width)
        && 
        (mouseY >= paint.y&& mouseY <= paint.y+paint.height))
        
    }
    $("#globalMouse").mousedown(function(e) {
        console.log("sdf3");
        if (isInsideBox(e)) {
            console.log("sdf");
            handleMouseDown(e);
        }
    });
    $("#globalMouse").mousemove(function(e) {
        if (isInsideBox(e)) {
            handleMouseMove(e);
        }
    });
    $("#globalMouse").mouseup(function(e) {
        if (isInsideBox(e)) {
            handleMouseUp(e);
        }
    });
    // $("#globalMouse").click(function(e) {
    //     if (!isInsideBox(e)) {
    //         return;
    //     }
    //     storedLines.length = 0;
    //     for (key in NODES_Storage) {
    //         NODES_Storage[key].Lines.length = 0;
    //     }
    //     redrawStoredLines();
    // });
    window.addEventListener("resize", resizeScreen, true);
    resizeScreen = function () {
        var sketch = document.querySelector('#myDiagramDiv');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
        //canvas.style.zIndex = 19;
        lineCtx.strokeStyle = document.getElementById("lineColor").value;
        lineCtx.lineWidth = document.getElementById("lineWidth").value;
        lineCtx.lineJoin = "round";
        lineCtx.lineCap = "round";
        redrawStoredLines();
    }


    function handleMouseDown(e) {
        // ignore code when in wrong mode
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
        // ignore code when in wrong mode
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
        lineCtx.strokeStyle = document.getElementById("lineColor").value;
        lineCtx.beginPath();
        lineCtx.moveTo(startX, startY);
        lineCtx.lineTo(mouseX, mouseY);
        lineCtx.stroke()

        if (!document.getElementById("lineCost").disabled) {
            lineCtx.font = "14px serif";
            lineCtx.fillStyle = "#FFFFFF"; 

            var letter = document.getElementById("lineCost").value;
            lineCtx.fillText(letter, (startX+mouseX)/2-10, (startY+mouseY)/2-10);
        }
    }

    function handleMouseUp(e) {
        // ignore code when in wrong mode
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
            color: lineCtx.strokeStyle,
            marked: -1,
            letter: {
                font: undefined,
                fillStyle: undefined,
                text: undefined
            },
            width: document.getElementById("lineWidth").value
        });

        // copy-paste is a bad practice. but
        if (!document.getElementById("lineCost").disabled) {
            storedLines[storedLines.length-1].letter["font"] = "14px serif";
            storedLines[storedLines.length-1].letter["fillStyle"] = "#FFFFFF";
            storedLines[storedLines.length-1].letter["text"] = document.getElementById("lineCost").value;
        }
        lineCtx.lineWidth = document.getElementById("lineWidth").value;
        lineCtx.strokeStyle = document.getElementById("lineColor").value;
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

            // if line is colored by Task, it overwrites main color
            if (storedLines[i].marked != -1) {
                lineCtx.strokeStyle = storedLines[i].marked;
            } else {
                lineCtx.strokeStyle = storedLines[i].color;
            }
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

            if (storedLines[i].letter.text != undefined) {
                lineCtx.font = storedLines[i].letter.font;
                lineCtx.fillStyle = storedLines[i].letter.fillStyle; 
                lineCtx.fillText(storedLines[i].letter.text, x, y);
            }
        }
    }
    resizeScreen();
    redrawStoredLines();
}