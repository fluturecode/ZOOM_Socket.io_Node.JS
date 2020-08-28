// Initialize Express server
const express = require("express");
// Initalize Express application
const app = express();
const cors = require("cors");

// Create server
const server = require("http").Server(app);
// Import socket.io
const io = require("socket.io")(server);
// Import Peer
const { ExpressPeerServer } = require("peer");
// Create Peer Express server
const peerServer = ExpressPeerServer(server, {
	debug: true,
});
// Import uuid
const User = require("./User.js");
const { v4: uuidv4 } = require("uuid");
let USER_LIST = {};

app.use(cors());
// Set view engine
app.set("view engine", "ejs");
// Tells server public files are here
app.use(express.static("public"));
// Tell ExpressPeerServer what url to use
app.use("/peerjs", peerServer);
// Create first url endpoint (where the app will live)
app.get("/", (req, res) => {
	// Redirect the view file 'room' to a room with a unique ID
	res.redirect(`/${uuidv4()}`);
});
// Create an endpoint for the room id
app.get("/:room", (req, res) => {
	res.render("room", { roomId: req.params.room });
});

// /**
//  * @description Emits message to all users in a specific room
//  * @param room {string} - Room name/id
//  * @param emit {string} - Name of message to emit
//  * @param message {any} - Message to be sent
//  **/

const sendToAllRoom = (room, emit, message) => {
	for (let i in USER_LIST) {
		if (USER_LIST[i].room == room) {
			USER_LIST[i].socket.emit(emit, message);
		}
	}
};

// Create socket connection
io.on("connection", (socket) => {
	socket.on("join-room", (roomId, userId) => {
		socket.id = userId;
		socket.room = roomId;
		socket.join(roomId);

		sendToAllRoom(roomId, "user-connected", userId);
		console.log(`joined ${roomId}`);

		USER_LIST[socket.id] = new User({
			name: `User_${USER_LIST.length}`,
			socket: socket,
		});
	});
	socket.on("message", (message) => {
		//send message to the same room
		console.log(message, USER_LIST[socket.id].room);
		//send message to the same room
		sendToAllRoom(USER_LIST[socket.id].room, "createMessage", message);
	});

	socket.on("disconnect", () => {
		sendToAllRoom(USER_LIST[socket.id].room, "user-disconnected", socket.id);
		delete USER_LIST[socket.id];
	});
});
// Server is local host at port '3030'
server.listen(process.env.PORT || 3030);
