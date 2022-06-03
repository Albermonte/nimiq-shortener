const express = require('express');
const app = express();
const PORT = 8080;
const http = require('http');
const server = http.createServer(app);
const fetch = require('node-fetch');
const endpoint = 'http://shortnim.cloudno.de/' + (process.env.endpoint || 'e41d83119dddb85780de8e281d94ff06cd7f26515ca5c002d915e9a5b9e3943c');
const custom_endpoint = 'https://db.neelr.dev/api/' + (process.env.custom || 'f342e581605973c9b0724178809dca9c');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/', express.static(__dirname + '/public', {
    extensions: ['html']
}));

app.post('/new_url', (req, resp) => {
    let query = req.body;
    let hash = null;

    checkURL = () => {
        if (query.shares >= 1) {
            let protocol_ok = query.url.startsWith("http://") || query.url.startsWith("https://") || query.url.startsWith("ftp://");
            if (query.url != '' && query.address != '' && protocol_ok) {
                getRandom();
            }
        }
    };

    getRandom = () => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        console.log(endpoint + "/" + text);
        fetch(endpoint + "/" + text)
            .then(res => {
                if (res.text())
                    if (!res.ok) {
                        hash = text;
                        sendRequest();
                    } else {
                        getRandom();
                    }
            })
            .catch(error => console.error('Fetch error at getRandom ', error));
    };

    sendRequest = () => {
        fetch(endpoint + "/" + hash, {
            method: 'POST',
            body: JSON.stringify(query),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(res => {
            if (res.ok)
                resp.send({ success: true, hash });
            else
                resp.send({ success: false });
        }).catch(error => { resp.send({ success: false }); console.error('Fetch error at sendRequest ', error); });
    };

    checkURL();
});

app.post('/redirect', (req, resp) => {
    const data = req.body;

    if (Number.isInteger(data.hash)) {
        fetch(custom_endpoint + "/" + data.hash)
            .then(res => {
                if (res.ok) {
                    json.result.url = 'Not yet';
                    resp.send({ success: true, data_to_redirect: res.json() });
                } else {
                    resp.send({ success: false, error: 'url_error' });
                }
            })
            .catch(error => {
                resp.send({ success: false, error });
                console.log('Error trying to fecth: ', data.hash);
            });
    } else {
        fetch(endpoint + "/" + data.hash)
            .then(async res => {
                if (res.ok) {
                    let json = (await res.json()).result;
                    json.url = 'Not yet';
                    resp.send({ success: true, data_to_redirect: json });
                } else {
                    resp.send({ success: false, error: 'url_error' });
                }
            })
            .catch(error => {
                resp.send({ success: false, error });
                console.log('Error trying to fecth: ', data.hash);
            });
    }
});

app.post('/share_found', (req, resp) => {
    const data = req.body;
    fetch(endpoint + "/" + data.hash)
        .then(res => res.json())
        .then(json => {
            if (json !== null && json.ok) {
                let shares_mined = 0;
                if (json.result.shares_mined !== null) {
                    shares_mined = parseInt(json.result.shares_mined);
                    shares_mined++;
                } else {
                    shares_mined++;
                }
                fetch(endpoint + "/" + data.hash, {
                    method: 'PUT',
                    body: JSON.stringify(
                        {
                            shares_mined,
                        }
                    ),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                })
                    .then(res => console.log('shares_mined ' + shares_mined))
                    .catch(error => console.error('Fetch error at share_found ', error))
                    .then(response => {
                        if (Number(data.shares) >= Number(json.result.shares)) {
                            resp.send({ success: true, url: json.result.url });
                        }
                    });

            } else {
                resp.send({ success: false, error: 'wrong_url' });
            }
        });
});

app.get('/statistics/:hash', (req, resp) => {
    const data = req.params;
    fetch(endpoint + "/" + data.hash)
        .then(async res => {
            if (res.ok) {
                resp.send({ success: true, statistics_answer: (await res.json()).result });
            } else {
                resp.send({ success: false, error: 'wrong_url' });
            }
        });
});

/*
socket.on('new_custom_url', (query) => {
    
    checkURL = () => {
        if (query.shares <= 3 && query.shares >= 1) {
            let protocol_ok = query.url.startsWith("http://") || query.url.startsWith("https://") || query.url.startsWith("ftp://")
            if (query.url != '' && query.address != '' && protocol_ok) {
                sendRequest()
            }
        }
    }
    
    sendRequest = () => {
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
    
    checkURL()
})
*/
server.listen(PORT);

process.on('unhandledRejection', (reason, p) => {
    console.log(`Unhandled Rejection ${reason}`);
});