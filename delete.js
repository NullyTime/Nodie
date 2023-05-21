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
			console.log("its actually works")
			return true;
		} else {
			console.log("it does not")
			return false;
		}


		// var circleSize = NODES_Storage[node.id].settings.circleSize;
		// var nodeX = node.offsetLeft+(circleSize/2);
		// var nodeY = node.offsetTop+(circleSize/2);

		// console.log({
		// 	1: nodeX,
		// 	2: nodeY,
		// 	3: mouseX,
		// 	4: mouseY
		// })

		// console.log(e);
		// if ((mouseX >= nodeX-circleSize/2 && mouseX <= (nodeX+circleSize/2))
		// 	&& 
		// 	(mouseY >= nodeY-circleSize/2 && mouseY <= (nodeY+circleSize/2))
		// ) {
		// 	console.log("its actually works")

		// } else {
		// 	console.log("it does not")
		//}
	}


	function detectClickedElem(e) {
		var place1 = document.getElementById("myDiagramDiv");

		//console.log(place1);
		var rect = e.target.parentElement.getBoundingClientRect();
        mouseX = parseInt(e.clientX - rect.left);
        mouseY = parseInt(e.clientY - rect.top);

        var flag = false; 
		for (var i=1;i<place1.children.length;i++) {
			//console.log(place1.children[i])

			if (NODES_Storage[e.target.id] != undefined) {
				console.log("finaly");
				flag = true;
				removeNode(e.target);
				updateTasksCrown();
				break;
			}
		}
		// if element was a node, no point of continuation
		if (flag) return;


	}



}