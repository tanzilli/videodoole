//var mqtt_broker="tangobox.local";
var mqtt_broker="mqttbox.local";
var mqtt_port=1884;
var vid;
var start_loop = null;
var end_loop = null;
var loop_active = null;
var canvas; 
var line=null;
var zoom=false;
var mouse_xpos
var mouse_ypos;


// Genera una stringa random di caratteri
// Viane usata per le funzioni MQTT
var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function onConnect() {
	mqtt_mainpage_client.subscribe("tangobox");
}

function onMessageArrived(message) {
	if (message.payloadString=="red") {
		console.log("red");
		canvasClear();
	}
	if (message.payloadString=="green") {
		console.log("green");
		videoPlay50();
	}
	if (message.payloadString=="blue") {
		console.log("blue");
		videoPlay100();
	}
	if (message.payloadString=="yellow") {
		console.log("yellow");
		toggleDraw();
	}
	if (message.payloadString=="black") {
		videoZoom();
	}
}	

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

function videoPlay100() {
	if (vid.paused==true || vid.playbackRate==0.5) {
		$("#play-100").html("Stop");
		vid.playbackRate=1
		vid.muted = false;
		vid.play();
		return;
	}
	
	if (vid.paused==false) {
		$("#play-100").html("Play 100%");
		vid.pause();
		return;
	}
}

function videoPlay50() {
	if (vid.paused==true || vid.playbackRate==1) {
		$("#play-50").html("Stop");
		vid.playbackRate=0.5
		vid.muted = true;
		vid.play();
		return;
	}
	
	if (vid.paused==false) {
		$("#play-50").html("Play 50%");
		vid.pause();
		return;
	}
}

function videoSeek(value) { 
	vid.currentTime=vid.currentTime+value;
} 

function videoLoad(filename) {
	console.log(filename);

	var mp4 = document.getElementById("mp4");
	mp4.src = "video/" + filename;

	vid.addEventListener( "loadedmetadata", function () {
		// retrieve dimensions
		let height = this.videoHeight;
		let width = this.videoWidth;

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
	videoPlay100();
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
	}, false );
	
	vid.load();
	videoPlay100();
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
			vid.currentTime=start_loop;
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

function toggleDraw() {
	if (canvas.isDrawingMode==true) {
		canvas.isDrawingMode=false;
	} else {
		canvas.isDrawingMode=true;
		
		if (line!=null) {
			canvas.remove(line);
			line=null;
			canvas.renderAll();
		}
	}
}

function videoZoom() {
	if (zoom==false) {
		zoom=true;
		var left=0-(mouse_xpos-(1920/2))*2;
		var top= 0-(mouse_ypos-(1080/2))*2;
		$("#video_layer").attr("style","top:" + top.toString() + "px;left:" + left.toString() + "px");
		$("#video_layer").attr("class","zoom");
	} else {
		zoom=false;
		$("#video_layer").attr("style","top:0px;left:0px");
		$("#video_layer").attr("class","no-zoom");
	}
}

function getMousePosition(e) {
	mouse_xpos = e.clientX;
	mouse_ypos = e.clientY;
	$("#comodo").html(mouse_xpos + " " + mouse_ypos);
}

$(document).ready(function() {
	// Interpretazione messaggi MQTT in arrivo
	mqtt_mainpage_client = new Paho.MQTT.Client(mqtt_broker, Number(mqtt_port), "/ws",randomString(20));
	mqtt_mainpage_client.onMessageArrived=onMessageArrived;
	mqtt_mainpage_client.connect({
		onSuccess:onConnect
	});

	vid = document.getElementById("video_player");

	range = document.getElementById("video-progress-bar");
	range.addEventListener('input', function () {
		vid.currentTime = range.value * vid.duration / 100;
	}, false);

	document.getElementById("video_player").addEventListener("click", function(){
		alert("Hello World");
	});

	
	window.addEventListener("mousewheel", function (event) {
		event.preventDefault();
	
		var y = event.deltaY;
	
		if (y<0) {
			vid.currentTime=vid.currentTime-0.1;
		} else {
			vid.currentTime=vid.currentTime+0.1;
		}
	}, {passive: false});

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
			videoPlay100();
			break;

		case "c":
			canvasClear(); 
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

	//****************************
	// Mouse Event
	//****************************

	// Right mouse button click
	window.addEventListener("contextmenu", function (event) {
		event.preventDefault();
   	}, false);

	// Left mouse button doubleclick
	window.addEventListener("dblclick", function (event) {
		event.preventDefault();
		canvasClear(); 
   	}, false);

	window.addEventListener("mousedown", function (event) {
		switch (event.which) {
			// Mouse wheel button click
			case 2:
				event.preventDefault();
				videoPlay100();
				break;
			case 3:
				event.preventDefault();
				videoZoom(); 
				break;
			case 4:
				event.preventDefault();
				videoPlay50();
				break;
			case 5:
				event.preventDefault();
				videoPlay50();
				break;
		}
	}, false);


	//****************************
	// Drawing
	//****************************

	canvas = this.__canvas = new fabric.Canvas('c', {
		isDrawingMode: false,
		selection: false,
	});
	fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
	canvas.freeDrawingBrush.color = "red";
	canvas.freeDrawingBrush.width = 4;

	$('#set-red').click (function() {
		canvas.freeDrawingBrush.color = "red";
	});

	$('#set-green').click(function() {
		canvas.freeDrawingBrush.color = "green";
	});

	$('#set-yellow').click(function() {
		canvas.freeDrawingBrush.color = "yellow";
	});

	// http://fabricjs.com/events 
	//canvas.isDrawingMode=false

	canvas.on('mouse:down', function(e) {

		if (canvas.isDrawingMode==true) {
			line=null;
			return;
		}
		if (line==null) {
			line = myLine([ e.pointer.x,e.pointer.y,e.pointer.x,e.pointer.y]);
			canvas.add(line);
			canvas.renderAll();
		} else {
			line=null;
		}
		canvas.forEachObject(function(object){ 
			object.selectable = false; 
		});

	});

	canvas.on('mouse:move', function(e) {
		if (line!=null) {
			line.set({ 'x2': e.pointer.x, 'y2': e.pointer.y })
			canvas.renderAll();
		}

		canvas.forEachObject(function(object){ 
			object.selectable = false; 
		});


	});
});

function canvasClear() {
	line=null;
	canvas.clear(); 
}

function myLine(coords) {
	return new fabric.Line(coords, {
		fill: canvas.freeDrawingBrush.color,
		stroke: canvas.freeDrawingBrush.color,
		strokeWidth: 5,
		selectable: false,
		evented: false,
	});
}

function myCircle(x,y) {
	var c = new fabric.Circle({
		left: x,
		top: y,
		strokeWidth: 5,
		radius: 8,
		fill: '#fff',
		stroke: '#666'
	});
	return c;
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

