const express = require('express');
const app = express();
const PORT = 80
const http = require('http');
const server = http.createServer(app)
const io = require('socket.io')(server);

server.listen(PORT);

app.get('/', function (req, res) {
    res.send(process.env.endpoint);
  });


io.on('connection', () => {
    console.log("User connected")
})