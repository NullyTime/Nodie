function deleteHandler(terminate) {
	if (terminate) {
		$("#globalMouse").unbind("mousemove");
		$("#globalMouse").unbind("mousedown");
		document.body.style.cursor = "default";	
		return;
	}
	document.body.style.cursor = "crosshair";


	$("#globalMouse").mousedown(function(e) {
	    var paint = document.getElementById("paint").getBoundingClientRect();
		var rect = e.target.parentElement.getBoundingClientRect();
        var mouseX = parseInt(e.clientX);
        var mouseY = parseInt(e.clientY);
        var circleSize = parseInt(document.getElementById("circleSize").value)/2;

		if ((mouseX >= paint.x && mouseX <= (paint.x+paint.width))
			&& 
			(mouseY >= paint.y && mouseY <= (paint.y+paint.height))
		) {
			detectClickedElem(e);
		}   
	});
	function isNode(e, node, mouseX, mouseY) {
		if (NODES_Storage[e.target.id] != undefined) {
			return true;
		} else {
			return false;
		}
	}


	function detectClickedElem(e) {
		var place1 = document.getElementById("myDiagramDiv");
		var rect = e.target.parentElement.getBoundingClientRect();
        mouseX = parseInt(e.clientX - rect.left);
        mouseY = parseInt(e.clientY - rect.top);

        var flag = false; 
		for (var i=1;i<place1.children.length;i++) {
			if (NODES_Storage[e.target.id] != undefined) {
				flag = true;
				removeNode(e.target);
				updateTasksCrown();
				uiAlgorithChange();
				break;
			}
		}
		// if element was a node, no point of continuation
		if (flag) return;
	}
}