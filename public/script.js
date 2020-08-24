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
		audio: false,
	})
	.then((stream) => {
		// Video stream comes from the promise
		myVideoStream = stream;
		addVideoStream(myVideo, stream);

		peer.on("call", (call) => {
			call.answer(stream);
			const video = document.createElement("video");
			call.on("stream", (userVideoStream) => {
				addVideoStream(video, userVideoStream);
			});
		});
		// Listen on user connected
		socket.on("user-connected", (userId) => {
			connectToNewUser(userId, stream);
		});
	});

// Listen on Peer connection, id is generated here
peer.on("open", (id) => {
	socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
	// Call connected user, send stream, create new video element, and connect their video stream
	const call = peer.call(userId, stream);
	const video = document.createElement("video");
	call.on("stream", (userVideoStream) => {
		addVideoStream(video, userVideoStream);
	});
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
