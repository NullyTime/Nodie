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