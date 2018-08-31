const express = require('express');
const app = express();
const PORT = 3340
const http = require('http');
const server = http.createServer(app)
const io = require('socket.io')(server);
const loki = require('lokijs')

server.listen(PORT);

let db = new loki('links.json', {
    autoload: true,
    autosave: true,
    autosaveInterval: 4000
})

io.on('connection', () => {
    console.log("User connected")
})