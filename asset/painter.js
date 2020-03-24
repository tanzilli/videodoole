function Painter() {
	var $ = function(id){
		return document.getElementById(id)
	};

	var canvas = this.__canvas = new fabric.Canvas('c', {
		isDrawingMode: true
	});

	$('clear-canvas').onclick = function() { 
		canvas.clear() 
	};

	$('set-red').onclick = function() {
		canvas.freeDrawingBrush.color = "red";
	};

	$('set-green').onclick = function() {
		canvas.freeDrawingBrush.color = "green";
	};

	$('set-yellow').onclick = function() {
		canvas.freeDrawingBrush.color = "yellow";
	};

	$('set-small').onclick = function() {
		canvas.freeDrawingBrush.width = 4;
	};

	$('set-medium').onclick = function() {
		canvas.freeDrawingBrush.width = 10;
	};

	$('set-big').onclick = function() {
		canvas.freeDrawingBrush.width = 20;
	};

   canvas.freeDrawingBrush.color = "red";
   //canvas.freeDrawingBrush.width = parseInt($('drawing-line-width').value, 10) || 1;
   canvas.freeDrawingBrush.width = 4;
}