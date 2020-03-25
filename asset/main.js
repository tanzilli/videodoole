var vid;

function fmtMSS(s){   // accepts seconds as Number or String. Returns m:ss
  return( s -         // take value s and subtract (will try to convert String to Number)
          ( s %= 60 ) // the new value of s, now holding the remainder of s divided by 60 
                      // (will also try to convert String to Number)
        ) / 60 + (    // and divide the resulting Number by 60 
                      // (can never result in a fractional value = no need for rounding)
                      // to which we concatenate a String (converts the Number to String)
                      // who's reference is chosen by the conditional operator:
          9 < s       // if    seconds is larger than 9
          ? ':'       // then  we don't need to prepend a zero
          : ':0'      // else  we do need to prepend a zero
        ) + s ;       // and we add Number s to the string (converting it to String as well)
}

function hideAllLayers() {
	console.log("HideAllLayer");
	$("#video_layer").fadeOut();
}

function videoToggle() { 
	if (vid.paused) {
		videoPlay();
	} else {
		videoPause();
	}
}

function videoPlay() { 
	if (vid.playbackRate==1) {
		vid.muted = false;
	} else {
		vid.muted = true;
	}	
	vid.play();
} 

function videoPause() { 
	vid.pause();
} 

function videoSeek(value) { 
	vid.currentTime=vid.currentTime+value;
} 

function videoToggleRate() { 
	if (vid.playbackRate == 1) {
		vid.muted = true;
		vid.playbackRate=0.5;
	} else {
		vid.muted = false;
		vid.playbackRate=1;
	}	
} 

function videoLoad(filename) {
	console.log(filename);

	var mp4 = document.getElementById("mp4");
	mp4.src = "video/" + filename;

	vid.addEventListener( "loadedmetadata", function () {
		// retrieve dimensions
		let height = this.videoHeight;
		let width = this.videoWidth;
		Painter();

		vid.addEventListener("timeupdate", function() {
		   // if the video is loaded and duration is known
		   if(!isNaN(this.duration)) {
				var percent_complete = this.currentTime / this.duration;
				$("#video_time").html(fmtMSS(Math.floor(this.currentTime)));
				$("#video_progress_bar").val(percent_complete*100);
				
				// use percent_complete to draw a progress bar
			}
		});
	}, false );



	vid.load();
	vid.play();
	vid.playbackRate=1;
	$("#videolist_layer").css("visibility", "hidden")
} 

function drag_drop(event) {
	event.preventDefault();

	var file = event.dataTransfer.files[0];
	var mp4 = document.getElementById("mp4");
	mp4.src = "video/" + file.name;

	vid.addEventListener( "loadedmetadata", function () {
		// retrieve dimensions
		let height = this.videoHeight;
		let width = this.videoWidth;
		Painter();
	}, false );
	
	vid.load();
	vid.play();
	vid.playbackRate=1;
	$("#play_button").html('<button onclick="videoPause()" class="pure-button pure-button-primary">Pause</button>');
}


function videoList(event) {
	if ($("#videolist_layer").css("visibility")=="visible") {
		$("#videolist_layer").css("visibility", "hidden")
	} else {
		$("#videolist_layer").css("visibility", "visible")
	} 
}

$(document).ready(function() {
	vid = document.getElementById("video_player");
	
	window.addEventListener("keydown", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}

		switch (event.key) {

		case "l":
			videoList();
			break;

		case " ":
			videoToggle();
			break;

		case "c":
			canvas.clear(); 
			break;

		case "ArrowDown":
			break;
		case "ArrowUp":
			break;

		case "ArrowLeft":
			videoSeek(-1);
			break;

		case "ArrowRight":
			videoSeek(1);
			break;
		default:
			console.log(event.key);	
			return; // Quit when this doesn't handle the key event.
		}

		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	}, true);


});


var canvas; 

function Painter() {
	canvas = this.__canvas = new fabric.Canvas('c', {
		isDrawingMode: true,
		selection: false
	});

	fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

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

	$('#new-stick').click(function() {
		canvas.isDrawingMode=false;
		stick();
	});

	$('#draw-edit').click(function() {
		if (canvas.isDrawingMode==true) {
			canvas.isDrawingMode=false;
		} else {
			canvas.isDrawingMode=true;
		}	
	});

	function makeLine(coords) {
		return new fabric.Line(coords, {
			fill: canvas.freeDrawingBrush.color,
			stroke: canvas.freeDrawingBrush.color,
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

	function stick() {
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
	}

   canvas.freeDrawingBrush.color = "red";
   canvas.freeDrawingBrush.width = 4;
   
}
