// Initialize Express server
const express = require("express");
// Initalize Express application
const app = express();
// Create server
const server = require("http").Server(app);
// Import uuid
const { v4: uuidv4 } = require("uuid");
// Set view engine
app.set("view engine", "ejs");
// Tells server public files are here
app.use(express.static("public"));

// Create first url endpoint (where the app will live)
app.get("/", (req, res) => {
	// Redirect the view file 'room' to a room with a unique ID
	res.redirect(`/${uuidv4()}`);
});
// Create an endpoint for the room id
app.get("/:room", (req, res) => {
	res.render("room", { roomId: req.params.room });
});

// Server is local host at port '3030'
server.listen(3030);
