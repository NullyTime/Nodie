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
    doTheAction();
    updatePage(currentStep, actionsTodo.length-1);
}

function doTheAction() {
    UnmarkLines();
    for (var i=1;i<=targetStep;i++) {
        switch(actionsTodo[i].action) {
            case "fill":
                for (var j=0;j<actionsTodo[i].target.length;j++) {
                    lineGetById(actionsTodo[i].target[j]).marked = document.getElementById("TasksLineColor").value ||"red";
                }
                break;

            case "letterChange":
                for (var j=0;j<actionsTodo[i].target.length;j++) {
                    lineGetById(actionsTodo[i].target[j][0]).markedLetter = actionsTodo[i].target[j][1];
                }
                break;

            case "clearLines":
                UnmarkLines();
                break;

            default:
                //UnmarkLetters();
                continue;
                break;
        }
    }
    
    
    currentStep = targetStep;
    redrawStoredLines();
}

function decipher(lineID, currentNode) {
    var targetNode = lineGetById(lineID).nodes;
    if (targetNode[0] == currentNode) {
        return targetNode[1];
    } else {
        return targetNode[0];
    }
}

function InDepth() {
    function nodeTail(main_node) {
        return (main_node[main_node.length-1]);
    }

    if (!possibilityCheck()) return;
    for (key in NODES_Storage) {
        NODES_Storage[key].isVisited = false;
    }

    var startingPoint = document.getElementById("TasksListCrown");

    if (startingPoint == null) return;
    startingPoint = startingPoint.options[startingPoint.selectedIndex].value;

    NODES_Storage[startingPoint]["isVisited"] = true;
    var main_node = [startingPoint];

    var testedNodes = 0;
    var NodesFilled = 1;
    var failure = 0;

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

            actionsTodo.push({
                action: "fill",
                target: [NODES_Storage[nodeTail(main_node)]["Lines"][i]]
            });

            NODES_Storage[targetNode]["isVisited"] = true;
            testedNodes = 0;
            NodesFilled += 1;
            main_node.push(targetNode);
        }
        if (testedNodes >= NODES_Storage[nodeTail(main_node)]["Lines"].length) {
            main_node.pop(main_node.length-1);
            testedNodes = 0;
            i += 1;
        }

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

    currentStep = 0;
    targetStep = 0;
    updatePage(currentStep, actionsTodo.length-1);
}

function inWidth() {
    if (!possibilityCheck()) return;

    // add flag for visiting a node
    for (key in NODES_Storage) {
        NODES_Storage[key].isVisited = false;
        NODES_Storage[key].isVisited2 = false;
    }

    var nodePath = [];
    var startingPoint = document.getElementById("TasksListCrown");
    if (startingPoint == null) return;
    startingPoint = startingPoint.options[startingPoint.selectedIndex].value;
    nodePath.push(startingPoint);
    NODES_Storage[startingPoint].isVisited = true;
    NODES_Storage[startingPoint].isVisited2 = true;

    var connections = [];
    while (true) {
        var mainNode = nodePath[nodePath.length-1];
        var connectedNodes = NODES_Storage[mainNode].Lines;
        for (var i=0;i<connectedNodes.length;i++)
        {
            var targetNode = decipher(connectedNodes[i], mainNode);
            if (NODES_Storage[targetNode].isVisited == false) {
                connections.push(""+mainNode+targetNode);
                NODES_Storage[targetNode].isVisited = true;
                //actionsTodo.push(connectedNodes[i]);
                actionsTodo.push({
                    action: "fill",
                    target: [connectedNodes[i]]
                });
            }
        }
        
        // search for visited2
        var flag = false;
        for (var i=0;i<connectedNodes.length;i++) {
            var targetNode = decipher(connectedNodes[i], mainNode);
            if (NODES_Storage[targetNode].isVisited2 == false) {
                NODES_Storage[targetNode].isVisited2 = true;
                flag = true;
                nodePath.push(targetNode);
                break;
            }
        }
        
        //if didn't found, then shift node path 
        if(!flag) {
            nodePath.splice(nodePath.length-1, 1);
        }
           
        if (nodePath.length == 0) {
            break;
        }
    }

    // cleaning trash
    for (key in NODES_Storage) {
        delete NODES_Storage[key].isVisited2;
    }

    currentStep = 0;
    targetStep = 0;
    updatePage(currentStep, actionsTodo.length-1);
}

function Kruskal() {
    if (!possibilityCheck()) return;
    for (var i=0;i<storedLines.length;i++) {
        if (storedLines[i].letter.text == undefined) {
            console.log("All lines should have cost");
            return;
        }
    }


    for (key in NODES_Storage) {
        NODES_Storage[key].isVisited = false;
    }   

    // just to not corrupt main storage 
    var lines = JSON.parse(JSON.stringify(storedLines));
    var nodes = JSON.parse(JSON.stringify(NODES_Storage));
    var nodesCount = {};
    for (var i=0;i<lines.length;i++) {
        lines[i].cost = Number(lines[i].letter.text);
        nodesCount[lines[i].nodes[0]] = false;
        nodesCount[lines[i].nodes[1]] = false;
    }
    // how much nodes we actually need to connect
    nodesCount = Object.keys(nodesCount).length;

    lines.sort((a, b) => (a.cost > b.cost)?1:((b.cost>a.cost)?-1:0));
    console.log(lines);

    // assign every node a group and when it's connecting merge
    var groups = [];
    for (key in NODES_Storage) {
        groups.push(key);
    }

    Array.prototype.find = function(match) {
        var matches = [];
        $.each(this, function(index, str) {
            if(str.indexOf(match) !== -1) {
                matches.push(index);
            }
        });
        return matches;
    }

    var cost = 0;
    for (var i=0;i<lines.length;i++) {
        var nodeLeft = lines[i].nodes[0];
        var nodeRight = lines[i].nodes[1];
        nodes[nodeLeft].isVisited = true;
        nodes[nodeRight].isVisited = true;
        
        var indexL = groups.find(nodeLeft)[0];
        var indexR = groups.find(nodeRight)[0];
        if (indexL == indexR) continue;

        cost += lines[i].cost;
        //actionsTodo.push(lines[i].id);
        actionsTodo.push({
            action: "fill",
            target: [lines[i].id]
        });
        groups[indexL] += groups[indexR];
        groups.splice(indexR, 1);
    }

    currentStep = 0;
    targetStep = 0;
    console.log("Суммарный вес: " + cost)
    updatePage(currentStep, actionsTodo.length-1);
}

function Prima() {
    if (!possibilityCheck()) return;

    for (key in NODES_Storage) {
        NODES_Storage[key].isVisited = false;
    }

    var startingPoint = document.getElementById("TasksListCrown");
    if (startingPoint == null) return;
    startingPoint = startingPoint.options[startingPoint.selectedIndex].value;

    NODES_Storage[startingPoint]["isVisited"] = true;
    var visited_nodes = [startingPoint];

    var failure = 0;
    // to calculate cost
    var sum = 0;

    while(visited_nodes.length != Object.keys(NODES_Storage).length) {
        // find the cheapest line
        // name, cost, line_id
        var best_choice = [-1, Number.MAX_SAFE_INTEGER, -1];
        for (var i=0;i<visited_nodes.length;i++) {
           var current_node = NODES_Storage[visited_nodes[i]];
           for (var j=0;j<current_node.Lines.length;j++) {
                var line = lineGetById(current_node.Lines[j]);
                var targetNode = line.nodes[0];
                if (targetNode == visited_nodes[i]) targetNode = line.nodes[1];
                if (NODES_Storage[targetNode].isVisited) continue;

                if (Number(line.letter.text) < best_choice[1]) {
                    best_choice[0] = line.nodes;
                    best_choice[1] = Number(line.letter.text);
                    best_choice[2] = line.id;
                }
           }
           
        }
        //console.log("best choice")
        //console.log(best_choice)

        if (visited_nodes.includes(best_choice[0][0])) {
            visited_nodes.push(best_choice[0][1]);
            NODES_Storage[best_choice[0][1]].isVisited = true;
        } else {
            visited_nodes.push(best_choice[0][0]);
            NODES_Storage[best_choice[0][0]].isVisited = true;
        }
        //actionsTodo.push(best_choice[2]);
        actionsTodo.push({
            action: "fill",
            target: [best_choice[2]]
        });
        sum += best_choice[1];

        //console.log("visited nodes")
        //console.log(visited_nodes)

        failure++;
        if (failure == 14) {
            console.log("broken");
            return;
        }
    }

    console.log("Суммарный вес: " + sum);
    currentStep = 0;
    targetStep = 0;
    updatePage(currentStep, actionsTodo.length-1);
}

function possibilityCheck() {
    if (Object.keys(NODES_Storage).length == 0) {
        return false;
    }
    return true;
}

function Dijkstra() {
    if (!possibilityCheck()) return;

    for (key in NODES_Storage) {
        NODES_Storage[key].isVisited = false;
        NODES_Storage[key].price = Number.MAX_SAFE_INTEGER;
        NODES_Storage[key].name = key;
    }

    var startingPoint = document.getElementById("TasksListCrown");
    if (startingPoint == null) return;
    startingPoint = startingPoint.options[startingPoint.selectedIndex].value;

    NODES_Storage[startingPoint]["isVisited"] = true;
    NODES_Storage[startingPoint]["price"] = 0;
    var nodePath = [[startingPoint,0]];

    // var lines = JSON.parse(JSON.stringify(storedLines));
    // for (var i=0;i<lines.length;i++) {
    //     lines[i].cost = Number(lines[i].letter.text);
    // }

    var failure = 0;
    var counter = 0;


    while (nodePath.length != 0) {
        //consolelog("this is run: " + counter)
        //consolelog(nodePath);


        var currentNode = nodePath[nodePath.length-1];
        var connectedNodes = NODES_Storage[currentNode[0]].Lines;
        var currentPrice = Number(NODES_Storage[currentNode[0]].price);
        NODES_Storage[currentNode[0]].isVisited = true;

        // we're moving to the cheapest node later
        var minimal = [-1, Number.MAX_SAFE_INTEGER, -1];



        for (var i=0;i<connectedNodes.length;i++) {
            //consolelog("This is " + i + " cycle")
            var targetNode = NODES_Storage[decipher(connectedNodes[i], currentNode[0])];
            //console.log(""+currentPrice+Number(connectedNodes[i].price))
            if (targetNode.isVisited) {
                continue;
            }
            //consolelog(targetNode)

            var targetPrice = Number(lineGetById(connectedNodes[i]).letter.text);
            //console.log(lineGetById(connectedNodes[i]).letter.text)
            //var targetPrice = 
            //console.log(connectedNodes[i].price);
            // consolelog("comapre")
            // consolelog(targetNode.price)
            // consolelog(currentPrice);
            // consolelog(targetPrice)
            if (targetNode.price > currentPrice+targetPrice) {
                targetNode.price = currentPrice+targetPrice;
                //consolelog("new value")
                //consolelog(targetNode)
            }

            if (minimal[1] > targetNode.price) {
                minimal[0] = targetNode.name;
                minimal[1] = targetNode.price;
                minimal[2] = connectedNodes[i];
            }
        }

        //console.log(NODES_Storage)
        //console.log("min")
        //console.log(minimal)

        
        if (minimal[0] == -1) {
            //consolelog("goping back")
            nodePath.splice(nodePath.length-1, 1);
        } else {
            nodePath.push([minimal[0], minimal[1]]);
            //actionsTodo.push(minimal[2]);
            actionsTodo.push({
                action: "fill",
                target: [minimal[2]]
            });
        }
        

        //consolelog("new target node");
        //consolelog(nodePath);
        failure++;
        counter++;
        if (nodePath.length == 0) break;
        if (failure == 9999) {
            //consolelog(nodePath);
            //consolelog("broken");
            return;
        }
    }

    //console.log("the ebnd")
    console.log(NODES_Storage)

    currentStep = 0;
    targetStep = 0;
    updatePage(currentStep, actionsTodo.length-1);
}

function Ford() {
    function nodeTail(main_node) {
        return (main_node[main_node.length-1]);
    }

    

    for (key in NODES_Storage) {
        //NODES_Storage[key].isVisited = false;
        NODES_Storage[key].name = key;
    }

    // Test
    document.getElementById("TasksListCrownEnd").value = "F";
    //////////////////////////////////



    var startPoint = document.getElementById("TasksListCrown");
    if (startPoint == null) return;
    startPoint = startPoint.options[startPoint.selectedIndex].value;

    var endPoint = document.getElementById("TasksListCrownEnd");
    if (endPoint == null) return;
    endPoint = endPoint.options[endPoint.selectedIndex].value;

    var nodePath = [startPoint];
    var failure = 0;
    var lines;

    for (var i=0;i<storedLines.length;i++) {
        storedLines[i].price = Number(storedLines[i].letter.text);
        storedLines[i].markedLetter = Number(storedLines[i].letter.text);
    }
    console.log(storedLines)


    function unMarkNodes() {
        for (key in NODES_Storage) {
            NODES_Storage[key].isVisited = false;
        }
    }

    // find path from start to end in depth
    function createPath() {
        unMarkNodes();
        NODES_Storage[startPoint]["isVisited"] = true;
        var main_node = [startPoint];



        var testedNodes = 0;
        var NodesFilled = 1;
        var failure2 = 0;
        linePath = [];

        var tempActions = [];

        while(true) {
            //console.log(main_node)

            var lines = NODES_Storage[nodeTail(main_node)]["Lines"];
            var best_choice = [-1, Number.MAX_SAFE_INTEGER, -1];
            for (var i=0;i<lines.length;i++) {
                var current_line = lineGetById(lines[i]);
                if (current_line.nodes[1] == main_node[main_node.length-1] || current_line.price == 0) continue;
                var targetNode = current_line.nodes[1];


                var targetNode = decipher(lines[i], nodeTail(main_node));

                // if we already visited this node, move to a new one
                if (NODES_Storage[targetNode]["isVisited"] == true) {
                    testedNodes += 1;
                    continue;
                }

                if (best_choice[1] > lineGetById(lines[i]).price) {
                    best_choice[0] = targetNode;
                    best_choice[1] = lineGetById(lines[i]).price;
                    best_choice[2] = lines[i];
                }
            }
            console.log(best_choice)
            if (best_choice[0] != -1) {
                tempActions.push(best_choice[2]);
                linePath.push([best_choice[2], best_choice[1]])

                NODES_Storage[best_choice[0]]["isVisited"] = true;
                testedNodes = 0;
                NodesFilled += 1;
                main_node.push(best_choice[0]);
            } else {
                console.log("This shit is broken")
                return;
            }



            // reached destination
            if (main_node[main_node.length-1] == endPoint) {
                nodePath = main_node.slice(0);
                actionsTodo.push({
                    action: "fill",
                    target: tempActions.slice(0)
                });
                break;
            }

            // dead end
            if (testedNodes >= lines.length) {
                main_node.pop(main_node.length-1);
                testedNodes = 0;
            }

            if (Object.keys(NODES_Storage).length == NodesFilled || main_node.length == 0) {
                nodePath = main_node.slice(0);
                actionsTodo.push({
                    action: "fill",
                    target: tempActions.slice(0)
                });

                var j = 0;
                while (j<main_node.length) {
                    main_node.splice(main_node.length-1, 1);
                    j += 1;
                }
                break;
            }


            failure2++;
            if (failure2 == 9999) {
                console.log("broken");
                return;
            }
        }
    }


    var SUM = 0;
    var linePath = [];

    while(true) {
        createPath();
        console.log(nodePath)
        console.log(linePath);

        if (linePath.length == 0 || (nodePath[0] != startPoint || nodePath[nodePath.length-1] != endPoint)) {
            console.log("The end");
            console.log("Sum: " + SUM);
            break;
        }

        // find the lowest cost
        var minVal = linePath[0][1];
        for (var i=1;i<linePath.length;i++) {
            if (minVal>linePath[i][1]) {
                minVal = linePath[i][1];
            }
        }

        var buff = [];
        // subtract all of them
        for (var i=0;i<linePath.length;i++) {
            var line = lineGetById(linePath[i][0]);
            line.price -=minVal;
            //line.markedLetter = line.price;
            buff.push([linePath[i][0], line.price]);
        }
        SUM += minVal;
        actionsTodo.push({
            action: "letterChange",
            target: buff.slice(0)
        });
        actionsTodo.push({
            action: "clearLines",
            target: []
        });
        
        nodePath.splice(1);

        failure++;
        if (failure == 999) {
            console.log(nodePath);
            console.log("broken");
            break;
        }
    }

    console.log(actionsTodo);

    currentStep = 0;
    targetStep = 0;
    updatePage(currentStep, actionsTodo.length-1);
}

// remove all coloring done by Algorithms
function UnmarkLines() {
    for (var i=0;i<storedLines.length;i++) {
        storedLines[i].marked = -1;
    }
    redrawStoredLines();
}
function UnmarkLetters() {
    for (var i=0;i<storedLines.length;i++) {
        storedLines[i].markedLetter = -1;
    }
    redrawStoredLines();
}