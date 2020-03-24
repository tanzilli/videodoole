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

	$('drawing-color').onchange = function() {
		canvas.freeDrawingBrush.color = this.value;
	};

	$('drawing-line-width').onchange = function() {
		canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
		this.previousSibling.innerHTML = this.value;
	};

   canvas.freeDrawingBrush.color = $('drawing-color').value;
   canvas.freeDrawingBrush.width = parseInt($('drawing-line-width').value, 10) || 1;
}