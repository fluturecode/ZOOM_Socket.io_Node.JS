// JavaScript for front end lives here

// Get video grid
const videoGrid = document.getElementById("video-grid");
console.log(videoGrid);
// Create a video element
const myVideo = document.createElement("video");
// Mute your own video
myVideo.muted = true;

let myVideoStream;
// Allows your device to get video/audiof output from the browser
navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream) => {
		myVideoStream = stream;
		addVideoStream(myVideo, stream);
	});

const addVideoStream = (video, stream) => {
	video.srcObject = stream;
	//when data loads, play the video
	video.addEventListener("loadmetadata", () => {
		video.play();
	});
	// Add the video to the video grid
	videoGrid.append(video);
};
