// JavaScript for front end lives here

// Import socketio
const socket = io("/");
// Get video grid
const videoGrid = document.getElementById("video-grid");
console.log(videoGrid);
// Create a video element
const myVideo = document.createElement("video");
// Mute your own video
myVideo.muted = true;

// Create a peer connectoin
var peer = new Peer(undefined, {
	path: "/peerjs",
	host: "/",
	port: "3030",
});

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

// Listen on Peer connection
peer.on("open", (id) => {
	socket.emit("join-room", ROOM_ID, id);
});

// Listen on user connected
socket.on("user-connected", (userId) => {
	connectToNewUser(userId);
});

const connectToNewUser = (userId) => {
	console.log(userId);
};

const addVideoStream = (video, stream) => {
	video.srcObject = stream;
	//when data loads, play the video
	video.addEventListener("loadmetadata", () => {
		video.play();
	});
	// Add the video to the video grid
	videoGrid.append(video);
};
