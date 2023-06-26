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

function removeLine(lineID, ignore) {
    // find and delete data from storedLines
    for (var i=0;i<storedLines.length;i++) {
        if (storedLines[i].id == lineID) {
            storedLines.splice(i, 1);
            redrawStoredLines();
            break;
        }
    }

    // find line in NODES_Storage and delete it
    for (var key in NODES_Storage) {
        for (var i=0;i<NODES_Storage[key].Lines.length;i++) {
            if (ignore == key) continue;
            if (lineID == NODES_Storage[key].Lines[i]) {
                NODES_Storage[key].Lines.splice(i, 1);
                i--;
            }
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
            (mouseY >= paint.y && mouseY <= paint.y+paint.height)
        )
    }
    $("#globalMouse").mousedown(function(e) {
        if (isInsideBox(e)) {
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
        if (document.getElementById("vector").value == "Oriented") {
            var headlen = 10;
            var angle = Math.atan2(mouseY-startY,mouseX-startX);
            lineCtx.beginPath();
            lineCtx.moveTo(mouseX, mouseY);

            lineCtx.lineTo(mouseX-headlen*Math.cos(angle-Math.PI/7),
                       mouseY-headlen*Math.sin(angle-Math.PI/7));
 
            //path from the side point of the arrow, to the other side point
            lineCtx.lineTo(mouseX-headlen*Math.cos(angle+Math.PI/7),
                       mouseY-headlen*Math.sin(angle+Math.PI/7));
         
            //path from the side point back to the tip of the arrow, and then
            //again to the opposite side point
            lineCtx.lineTo(mouseX, mouseY);
            lineCtx.lineTo(mouseX-headlen*Math.cos(angle-Math.PI/7),
                       mouseY-headlen*Math.sin(angle-Math.PI/7));
         
            //draws the paths created above
            lineCtx.stroke();
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

        lineCtx.lineWidth = document.getElementById("lineWidth").value;
        lineCtx.strokeStyle = document.getElementById("lineColor").value;
        
        storedLines.push({
            x1: startX,
            y1: startY,
            x2: mouseX,
            y2: mouseY,
            color: lineCtx.strokeStyle,
            marked: -1,
            markedLetter: -1,
            letter: {
                font: undefined,
                fillStyle: undefined,
                text: undefined
            },
            width: document.getElementById("lineWidth").value,
            isVector: ((document.getElementById("vector").value == "Oriented")?true:false)
        });

        // copy-paste is a bad practice. but
        if (!document.getElementById("lineCost").disabled) {
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

            var fromX = storedLines[i].x1;
            var fromY = storedLines[i].y1;
            var toX = storedLines[i].x2;
            var toY = storedLines[i].y2;

            // if line is colored by Task, it overwrites main color
            if (storedLines[i].marked != -1) {
                lineCtx.strokeStyle = storedLines[i].marked;
            } else {
                lineCtx.strokeStyle = storedLines[i].color;
            }
            lineCtx.lineWidth = storedLines[i].width;
            lineCtx.beginPath();
            lineCtx.moveTo(fromX, fromY);
            lineCtx.lineTo(toX, toY);
            lineCtx.stroke();

            if (storedLines[i].letter.text != undefined) {
                // letters
                var x = (storedLines[i].x1+storedLines[i].x2)/2-10;
                var y;
                if (storedLines[i].y1>storedLines[i].y2) {
                    var y = (storedLines[i].y1+storedLines[i].y2)/2-10;
                } else {
                    var y = (storedLines[i].y1+storedLines[i].y2)/2+20;
                }

                if (storedLines[i].markedLetter == -1) {
                    lineCtx.font = storedLines[i].letter.font;
                    lineCtx.fillStyle = storedLines[i].letter.fillStyle; 
                    lineCtx.fillText(storedLines[i].letter.text, x, y);
                } else {
                    lineCtx.font = storedLines[i].letter.font;
                    lineCtx.fillStyle = storedLines[i].letter.fillStyle; 
                    lineCtx.fillText(storedLines[i].markedLetter, x, y);
                }
            }

            // Draw tip of the arrow
            if (storedLines[i].isVector) {
                var headlen = 10;
                var angle = Math.atan2(toY-startY,toX-fromX);
                lineCtx.beginPath();
                lineCtx.moveTo(toX, toY);

                lineCtx.lineTo(toX-headlen*Math.cos(angle-Math.PI/7),
                           toY-headlen*Math.sin(angle-Math.PI/7));

                //path from the side point of the arrow, to the other side point
                lineCtx.lineTo(toX-headlen*Math.cos(angle+Math.PI/7),
                           toY-headlen*Math.sin(angle+Math.PI/7));
             
                //path from the side point back to the tip of the arrow, and then
                //again to the opposite side point
                lineCtx.lineTo(toX, toY);
                lineCtx.lineTo(toX-headlen*Math.cos(angle-Math.PI/7),
                           toY-headlen*Math.sin(angle-Math.PI/7));
             
                //draws the paths created above
                lineCtx.stroke();
            }
        }
    }
    resizeScreen();
    redrawStoredLines();
}
function lineGetById(id) {
    for (var i=0;i<storedLines.length;i++) {
        if (storedLines[i].id == id) {
            return storedLines[i];
        }
    }
    return undefined;
};