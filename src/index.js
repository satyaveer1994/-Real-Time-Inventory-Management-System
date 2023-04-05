const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const socketio = require('socket.io');
const route = require("./routes/route.js");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", route);
// database connection
mongoose.connect(
  "mongodb+srv://Satyaveer1994:Satyaveer123@cluster0.pn1nk.mongodb.net/satyaveer-DB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("Connected to the database");
});

mongoose.connection.on("error", (err) => {
  console.error(`Failed to connect to the database: ${err}`);
});

// socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
});

http.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
