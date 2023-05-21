// need to save state for algorithms

var currentStep = 0;
var targetStep = 0;
var actionsTodo = [-1];

function stepByStep(value) {
    switch (value) {
        case "right":
            targetStep = currentStep+1;
            break;
        case "left":
            targetStep = currentStep-1;
            break;
        case "start":
            targetStep = 0;
            break;
        case "end":
            targetStep = actionsTodo.length-1;
            break;
    }
    if (targetStep > actionsTodo.length-1) targetStep = actionsTodo.length-1;
    else if (targetStep < 0) targetStep = 0;
    updateColoring();
    updatePage(currentStep, actionsTodo.length-1);
}

function updateColoring() {
    if (targetStep > currentStep) {
        for (var i=currentStep;i<=targetStep;i++) {
            if (actionsTodo[i] == -1) continue;
            lineGetById(actionsTodo[i]).marked = "green";
        }
    } else {
        for (var i=currentStep;i>targetStep;i--) {
            if (actionsTodo[i] == -1) continue;
            lineGetById(actionsTodo[i]).marked = -1;
        }
    }
    currentStep = targetStep;
    redrawStoredLines();
}

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

    for (key in NODES_Storage) {
        NODES_Storage[key].isVisited = false;
    }

    

    var results = [];
    var buff = "";

    var startingPoint = document.getElementById("TasksListCrown");
    startingPoint = startingPoint.options[startingPoint.selectedIndex].value;

    NODES_Storage[startingPoint]["isVisited"] = true;
    var main_node = [startingPoint];

    var testedNodes = 0;
    var NodesFilled = 1;
    console.log(NODES_Storage)
    console.log(storedLines)
    var failure = 0;

    function decipher(lineID, currentNode) {
        var targetNode = lineGetById(lineID).nodes;
        if (targetNode[0] == nodeTail(main_node)) {
            return targetNode[1];
        } else {
            return targetNode[0];
        }
    }

    while(true) {
        var i = 0;
        while (i<NODES_Storage[nodeTail(main_node)]["Lines"].length) {
            var targetNode = decipher(NODES_Storage[nodeTail(main_node)]["Lines"][i], nodeTail(main_node));

            // if we already visited this node, move to a new one
            if (NODES_Storage[targetNode]["isVisited"] == true) {
                testedNodes += 1;
                i += 1;
                continue;
            }
            // 
            actionsTodo.push(NODES_Storage[nodeTail(main_node)]["Lines"][i]);

            NODES_Storage[targetNode]["isVisited"] = true;
            testedNodes = 0;
            NodesFilled += 1;
            buff += main_node[main_node.length-1] + " -> ";
            buff += targetNode;
            console.log(buff);
            buff = "";

            console.log(main_node);
            results.push(""+main_node[main_node.length-1]+targetNode);
            console.log("results");
            console.log(results);
            main_node.push(targetNode);
            console.log("found node:" + main_node);
        }
        console.log(nodeTail(main_node));
        if (testedNodes >= NODES_Storage[nodeTail(main_node)]["Lines"].length) {
            console.log("Hit the wall");
            console.log(main_node);
            main_node.pop(main_node.length-1);
            console.log(main_node);
            testedNodes = 0;
            i += 1;
        }

        buff = ""
        if (Object.keys(NODES_Storage).length == NodesFilled || main_node.length == 0) {
            var j = 0;
            while (j<main_node.length) {
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
                //storedLines[j].marked = "green";
            }  
        }
    }
    redrawStoredLines();
    console.log(results);
    console.log("The end");
    console.log(actionsTodo);

    currentStep = 0;
    targetStep = 0;
    updatePage(currentStep, actionsTodo.length-1);
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

// remove all coloring done by Algorithms
function UnmarkLines() {
    for (var i=0;i<storedLines.length;i++) {
        storedLines[i].marked = -1;
    }
    redrawStoredLines();
    actionsTodo.splice(1);
}