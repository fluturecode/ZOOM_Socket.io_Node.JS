// Initialize Express server
const express = require("express");
// Initalize Express application
const app = express();
// Create server
const server = require("http").Server(app);
// Import socket.io
const io = require("socket.io")(server);
// Import uuid
const { v4: uuidv4 } = require("uuid");
// Import Peer
const { ExpressPeerServer } = require("peer");
// Create Peer Express server
const peerServer = ExpressPeerServer(server, {
	debug: true,
});
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
// Create socket connection
io.on("connection", (socket) => {
	socket.on("join-room", (roomId, userId) => {
		socket.join(roomId);
		socket.to(roomId).broadcast.emit("user-connected", userId);
	});
});
// Server is local host at port '3030'
server.listen(3030);
