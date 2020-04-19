const express = require('express');
const app = express();
const PORT = 8080
const http = require('http');
const server = http.createServer(app)
const io = require('socket.io')(server);
const fetch = require('node-fetch')
const endpoint = process.env.endpoint
const custom_endpoint = process.env.custom

server.listen(PORT);

app.use('/', express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('New user connected ' + (new Date()).toString())

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
                .catch(error => console.error('Fetch error'))
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
                .catch(error => console.error('Fetch error'))
                .then(response => {
                    io.sockets.to(query.id).emit('success', hash)
                });
        }

        check_url()
    })


    socket.on('redirect', (data) => {
        if (Number.isInteger(data.hash)) {
            fetch(custom_endpoint + "/" + data.hash)
                .then(res => res.json())
                .then(json => {
                    if (json.result != null) {
                        json.result.url = 'Not yet'
                        io.sockets.to(data.id).emit('data_to_redirect', json)
                    } else {
                        io.sockets.to(data.id).emit('url_error')
                    }
                })
                .catch(err => {
                    socket.emit('error', err)
                    console.log('Error trying to fecth: ', data.hash)
                })
        } else {
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
                .catch(err => {
                    socket.emit('error', err)
                    console.log('Error trying to fecth: ', data.hash)
                })
        }
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
                        .catch(error => console.error('Fetch error'))
                        .then(response => {
                            if (json.result.shares == data.shares) {
                                io.sockets.to(data.id).emit('finished', json.result.url)
                            }
                        });

                } else {
                    io.sockets.to(data.id).emit('wrong_url')
                }
            })
    })

    socket.on('statistics', (data) => {
        fetch(endpoint + "/" + data.hash)
            .then(res => res.json())
            .then(json => {
                if (json.result != null) {
                    io.sockets.to(data.id).emit('statistics_answer', json)
                } else {
                    io.sockets.to(data.id).emit('wrong_url')
                }
            })
    })

    socket.on('new_custom_url', (query) => {

        check_url = () => {
            if (query.shares <= 3 && query.shares >= 1) {
                let protocol_ok = query.url.startsWith("http://") || query.url.startsWith("https://") || query.url.startsWith("ftp://")
                if (query.url != '' && query.address != '' && protocol_ok) {
                    send_request()
                }
            }
        }

        send_request = () => {
            fetch(custom_endpoint + "/" + query.hash, {
                    method: 'POST',
                    body: JSON.stringify(query),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }).then(res => res.json())
                .catch(error => console.error('Fetch error'))
                .then(response => {
                    io.sockets.to(query.id).emit('success', query.hash)
                });
        }

        check_url()
    })

})

process.on('unhandledRejection', (reason, p) => {
    console.log(`Unhandled Rejection`);
  });