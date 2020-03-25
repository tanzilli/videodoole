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
	$("#play_button").html('<button onclick="videoPause()" class="pure-button pure-button-primary">Stop</button>');
	if (vid.playbackRate==1) {
		vid.muted = false;
	} else {
		vid.muted = true;
	}	
	vid.play();
} 

function videoPause() { 
	vid.pause();
	$("#play_button").html('<button onclick="videoPlay()" class="pure-button pure-button-primary">Play</button>');
} 

function videoSeek(value) { 
	vid.currentTime=vid.currentTime+value;
} 

function videoPlaybackNormal() { 
	$("#speed_button").html('<button onclick="videoPlaybackSlow()" class="pure-button pure-button-primary">100 %</button>');
	vid.playbackRate = 1;
	vid.muted = false;
} 

function videoPlaybackSlow() { 
	$("#speed_button").html('<button onclick="videoPlaybackNormal()" class="pure-button pure-button-primary">50 %</button>');
	vid.playbackRate = 0.5;
	vid.muted = true;
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

$(document).ready(function() {
	vid = document.getElementById("video_player");
	
	window.addEventListener("keydown", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}

		switch (event.key) {

		case "l":
			if ($("#videolist_layer").css("visibility")=="visible") {
				$("#videolist_layer").css("visibility", "hidden")
			} else {
				$("#videolist_layer").css("visibility", "visible")
			} 
			break;

		case " ":
			videoToggle();
			break;

		case "c":
			canvas.clear(); 
			break;

		case "ArrowDown":
			// code for "down arrow" key press.
			break;
		case "ArrowUp":
			// code for "up arrow" key press.
			break;
		case "ArrowLeft":
			// code for "left arrow" key press.
			break;
		case "ArrowRight":
			// code for "right arrow" key press.
			break;
		default:
			console.log(event.key);	
	
		return; // Quit when this doesn't handle the key event.
	}

		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	}, true);


});
