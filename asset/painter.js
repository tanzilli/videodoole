function Painter() {
	var canvas = this.__canvas = new fabric.Canvas('c', {
		isDrawingMode: true,
		selection: false
	});

	fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';


	$('#clear-canvas').click(function() { 
		canvas.clear() 
	});

	$('#set-red').click (function() {
		canvas.freeDrawingBrush.color = "red";
	});

	$('#set-green').click(function() {
		canvas.freeDrawingBrush.color = "green";
	});

	$('#set-yellow').click(function() {
		canvas.freeDrawingBrush.color = "yellow";
	});

	$('#set-small').click(function() {
		canvas.freeDrawingBrush.width = 4;
	});

	$('#set-medium').click(function() {
		canvas.freeDrawingBrush.width = 10;
	});

	$('#set-big').click(function() {
		canvas.freeDrawingBrush.width = 20;
	});

	$('#draw').click(function() {
		if ($('#draw').html()=="Draw OFF") {
			canvas.isDrawingMode=true;
			$('#draw').html("Draw ON");
		} else {
			canvas.isDrawingMode=false;
			$('#draw').html("Draw OFF");
		}	
	});

	function makeLine(coords) {
		return new fabric.Line(coords, {
			fill: 'red',
			stroke: 'red',
			strokeWidth: 5,
			selectable: false,
			evented: false,
		});
	}

	function makeCircle(left, top, line1, line2) {
		var c = new fabric.Circle({
			left: left,
			top: top,
			strokeWidth: 4,
			radius: 8,
			fill: '#fff',
			stroke: '#666'
		});
		c.hasControls = c.hasBorders = false;

		c.line1 = line1;
		c.line2 = line2;

		return c;
	}

	$('#stick').click(function() {
		canvas.isDrawingMode=false;
		$('#draw').html("Draw OFF");

		var line = makeLine([ 250, 125, 250, 275 ]);
		canvas.add(line);

		canvas.add(
			makeCircle(line.get('x1'), line.get('y1'), null, line),
			makeCircle(line.get('x2'), line.get('y2'), line),
		);

		canvas.on('object:moving', function(e) {
			var p = e.target;
			p.line1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
		    p.line2 && p.line2.set({ 'x1': p.left, 'y1': p.top });
			canvas.renderAll();
		});


	});

   canvas.freeDrawingBrush.color = "red";
   canvas.freeDrawingBrush.width = 4;
}
