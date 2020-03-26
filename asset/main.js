var vid;
var start_loop = null;
var end_loop = null;
var loop_active = null;

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
	$("#play").attr("style","background: grey;");
	$("#play").html("Stop");
	if (vid.playbackRate==1) {
		vid.muted = false;
	} else {
		vid.muted = true;
	}	
	vid.play();
} 

function videoPause() { 
	$("#play").attr("style","background: lightblue;");
	$("#play").html("Play");
	vid.pause();
} 

function videoSeek(value) { 
	vid.currentTime=vid.currentTime+value;
} 

function videoToggleRate() { 
	if (vid.playbackRate == 1) {
		vid.muted = true;
		vid.playbackRate=0.5;
		$("#play-rate").attr("style","background: lightblue;");
		$("#play-rate").html("100%");
	} else {
		vid.muted = false;
		vid.playbackRate=1;
		$("#play-rate").attr("style","background: lightblue;");
		$("#play-rate").html("50%");
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
				$("#video-time").html(fmtMSS(Math.floor(this.currentTime)));
				$("#video-progress-bar").val(percent_complete*100);
				
				// use percent_complete to draw a progress bar
				
				if (start_loop!=null && end_loop!=null && loop_active==true) {
					if (this.currentTime>=end_loop) {
						this.currentTime=start_loop;
					}
				}
			}
		});
	}, false );

	vid.load();
	vid.playbackRate=1;
	videoPlay();
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
	vid.playbackRate=1;
	videoPlay();
	$("#videolist_layer").css("visibility", "hidden")
}

function videoLoop() {
	if (loop_active==true) {
		loop_active=false;
		$("#video-loop").attr("style","background: grey;");
		$("#video-loop").html("Loop [L]");
	} else {
		if (start_loop!=null && end_loop!=null) {
			loop_active=true;
			$("#video-loop").attr("style","background: red;");
			$("#video-loop").html("Loop [L]");
		}
	}
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

	range = document.getElementById("video-progress-bar");
	range.addEventListener('input', function () {
		// $("#comodo").html(range.value);
		vid.currentTime = range.value * vid.duration / 100;
	}, false);
	
	window.addEventListener("keydown", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}

		switch (event.key) {

		case "a":
			start_loop=vid.currentTime;
			break;

		case "b":
			end_loop=vid.currentTime;
			break;

		case "l":
			videoLoop();
			break;

		case "v":
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
		var line = makeLine([ 1980/2, 400,1980/2, 600 ]);
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
