const express = require('express');
const app = express();
const PORT = 80
const http = require('http');
const server = http.createServer(app)
const io = require('socket.io')(server);
const fetch = require('node-fetch')
const endpoint = process.env.endpoint

server.listen(PORT);

app.get('/', function (req, res) {
    res.send("Nothing to see here");
});


io.on('connection', (socket) => {
    console.log("User connected", socket.id)

    socket.on('new_url', (query) => {
        let hash = null

        check_url = () => {
            if (query.shares <= 3 && query.shares >= 1) {
                let protocol_ok = query.url.startsWith("http://") || query.url.startsWith("https://") || query.url.startsWith("ftp://")
                if (query.url != '' && query.address != '' && protocol_ok) {
                    getrandom()
                }
            }
        }

        getrandom = () => {
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (let i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            fetch(endpoint + "/" + text)
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    if (response.result == null) {
                        console.log(text)
                        hash = text
                        send_request();
                    } else {
                        getrandom()
                    }
                });
        }

        send_request = () => {
            fetch(endpoint + "/" + hash, {
                    method: 'POST',
                    body: JSON.stringify(query),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }).then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    console.log('Success: ', response)
                    io.sockets.to(query.id).emit('success', hash)
                });
        }

        check_url()
    })


    socket.on('redirect', (data) => {
        fetch(endpoint + "/" + data.hash)
            .then(res => res.json())
            .then(json => {
                if (json.result != null) {
                    json.result.url = 'Not yet'
                    io.sockets.to(data.id).emit('data_to_redirect', json)
                } else {
                    io.sockets.to(data.id).emit('url_error')
                }
            })
    })

    socket.on('share_found', (data) => {
        fetch(endpoint + "/" + data.hash)
            .then(res => res.json())
            .then(json => {
                if (json.result != null) {
                    let shares_mined = 0
                    if (json.result.shares_mined != null) {
                        shares_mined = parseInt(json.result.shares_mined)
                        shares_mined++
                    } else {
                        shares_mined++
                    }

                    fetch(endpoint + "/" + data.hash + '/shares_mined', {
                            method: 'PUT',
                            body: shares_mined,
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                            }
                        })
                        .then(res => res.json())
                        .catch(error => console.error('Error:', error))
                        .then(response => {
                            if (json.result.shares == data.shares) {
                                io.sockets.to(data.id).emit('finished', json.result.url)
                            }
                        });

                } else {
                    socket.emit('wrong_url')
                }
            })
    })

    socket.on('statistics', (hash) => {
        fetch(endpoint + "/" + hash)
            .then(res => res.json())
            .then(json => {
                if (json.result != null) {
                    socket.emit('statistics_answer', json)
                } else {
                    socket.emit('wrong_url')
                }
            })
    })
})