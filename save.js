const StringSeparator = "<--->";

// save data in cookies
function saveStateCookie() {
    var tempNODES_Storage = JSON.parse(JSON.stringify(NODES_Storage));

    // adding location for each node
    for (key in tempNODES_Storage) {
        var node = document.getElementById(key);
        tempNODES_Storage[key].settings.x = node.offsetLeft+20;
        tempNODES_Storage[key].settings.y = node.offsetTop+20;
    }

    document.cookie = JSON.stringify(tempNODES_Storage) + StringSeparator;
    
    // adding lines
    document.cookie += JSON.stringify(storedLines) + StringSeparator;

    // adding letters
    var select_letters = document.getElementById("node_names");
    var NODE_Names = [];
    for (var i=0;i<select_letters.length;i++) {
        NODE_Names.push(select_letters[i].value);
    }
    document.cookie += JSON.stringify(NODE_Names);

    //adding some setting
    var globalSettings = {
        "globalZInndex": globalZInndex
    };
    document.cookie += StringSeparator + JSON.stringify(globalSettings);
}

// save button
function saveState() {
    // var textData = "";

    // // // need to save: nodes, lines, letters
    // // var tempNODES_Storage = JSON.parse(JSON.stringify(NODES_Storage));

    // // // adding location for each node
    // // for (key in tempNODES_Storage) {
    // //     var node = document.getElementById(key);
    // //     tempNODES_Storage[key].x = node.offsetLeft+20;
    // //     tempNODES_Storage[key].y = node.offsetTop+20;
    // //     //tempNODES_Storage[key].isVisited = false;
    // // }

    // // document.cookie = JSON.stringify(tempNODES_Storage) + "<--->";
    
    // // // adding lines
    // // var tempStoredLines = JSON.parse(JSON.stringify(storedLines));
    // // for (var i=0;i<tempStoredLines.length;i++) {
    // //     tempStoredLines[i].color = defaultLineColor;
    // // }   
    // // document.cookie += JSON.stringify(tempStoredLines) + "<--->";

    // // // adding letters
    // // var select_letters = document.getElementById("node_names");
    // // var NODE_Names = [];
    // // for (var i=0;i<select_letters.length;i++) {
    // //     NODE_Names.push(select_letters[i].value);
    // // }
    // // document.cookie += JSON.stringify(NODE_Names);




    // // need to save: nodes, lines, letters
    // var tempNODES_Storage = JSON.parse(JSON.stringify(NODES_Storage));

    // // adding location for each node
    // for (key in tempNODES_Storage) {
    //     var node = document.getElementById(key);
    //     tempNODES_Storage[key].settings.x = node.offsetLeft+20;
    //     tempNODES_Storage[key].settings.y = node.offsetTop+20;
    //     //tempNODES_Storage[key].isVisited = false;
    // }

    // textData += JSON.stringify(tempNODES_Storage) + "<--->";
    
    // // adding lines
    // var tempStoredLines = JSON.parse(JSON.stringify(storedLines));
    // for (var i=0;i<tempStoredLines.length;i++) {
    //     tempStoredLines[i].color = defaultLineColor;
    // }   
    // textData += JSON.stringify(tempStoredLines) + "<--->";

    // // adding letters
    // var select_letters = document.getElementById("node_names");
    // var NODE_Names = [];
    // for (var i=0;i<select_letters.length;i++) {
    //     NODE_Names.push(select_letters[i].value);
    // }
    // textData += JSON.stringify(NODE_Names);

    // function saveFile(fileName, urlFile){
    //     var a = document.createElement("a");
    //     a.style = "display: none";
    //     document.body.appendChild(a);
    //     a.href = urlFile;
    //     a.download = fileName;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     a.remove();
    // }

    // var blobData = new Blob([textData], {type: "text/plain"});
    // var url = window.URL.createObjectURL(blobData);
    // saveFile('archivo.txt',url);
}

// function selectFile (contentType, multiple){
//     return new Promise(resolve => {
//         let input = document.createElement('input');
//         input.type = 'file';
//         input.multiple = multiple;
//         input.accept = contentType;

//         input.onchange = _ => {
//             let files = Array.from(input.files);
//             if (multiple)
//                 resolve(files);
//             else
//                 resolve(files[0]);
//         };

//         input.click();
//     });
// }

// load data from cookies
function loadStateCookie() {
    var decodedCookie = decodeURIComponent(document.cookie).split(StringSeparator);
    if (decodedCookie.length == 1) {
        console.log("No cookies");
        return;
    }

    // deleting everything
    removeNode("!ALL"); 

    var tempNODES_Storage = JSON.parse(decodedCookie[0]);
    // add nodes in the field
    for (key in tempNODES_Storage) {
        tempNODES_Storage[key].nodeName = key;
        nodeCreationMode(false, tempNODES_Storage[key])
    }

    // add lines in the field
    storedLines = JSON.parse(decodedCookie[1]);

    //
    redrawStoredLines();

    // update letters list
    LetterManager(3, JSON.parse(decodedCookie[2]));

    // set globalZInndex
    globalZInndex = JSON.parse(decodedCookie[3])["globalZInndex"];
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
        
        node.style.left = (NODES_Storage[key].x-node2.x+20-7) + "px";
        node.style.top = (NODES_Storage[key].y-node2.y+170+9) + "px";
    }

    // add lines in the field
    storedLines = JSON.parse(decodedCookie[1]);
    redrawStoredLines();

    // update letters list
    LetterManager(3, JSON.parse(decodedCookie[2]));
}