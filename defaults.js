// Script to define default values

const defaultCircleOutlineColor = '#000000';

var TableofDefaults = {
	// Nodes
	"circleSize": "40",		// Circle Diameter
	"borderSize": "1",		// Cirlce border size 
	"fontSize": "17",		// Font size of a circle

	"circleColor": "#FD1385",
	"fontColor": "#000000",
	"borderColor": "#000000",

	// Lines
	"lineCost": "3",
	"lineWidth": "1",
	"lineColor": "#23C1FF"
} 



function setDefaultValue(element) {
	var target = document.getElementById(element);
	target.value = TableofDefaults[element];

	// in case set to default and Auto Font Size Mode is active
	if (element == "circleSize" && document.getElementById("fontSize").disabled) {
		setAutoFontValue();
	}
}










