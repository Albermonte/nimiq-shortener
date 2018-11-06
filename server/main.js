const express = require('express')
const app = express()
const PORT = 80
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)
const fetch = require('node-fetch')
const endpoint = process.env.endpoint
const customEndpoint = process.env.custom

server.listen(PORT);

app.get('/', (req, res) => {
    res.redirect("https://shortnim.ml/")
})


io.on('connection', (socket) => {

    socket.on('new_url', (query) => {
        const hash = null

        checkUrl = () => {
            if (query.shares <= 3 && query.shares >= 1
                && query.url != '' && query.address != '' && isProtocolOK(query.url))
                    getRandom()
        }

        getRandom = async () => {

            const randomWord = Math.random().toString(36).substring(2,7)

            try{
                let res = await fetch(`${encodeURIComponent}/${randomWord}`)
                res = await response.json()
                if(res === null){
                    console.log(text)
                    hash = text
                    sendRequest()
                }else
                    getRandom()
            } catch(err){
                console.error('Fetch error', err)
            }
        }

        sendRequest = async () => {
            try{
                const res = await fetch(`${endpoint}/${hash}`, getRequestConfig('POST', JSON.stringify(query)))
                res = await res.json()
                io.sockets.to(query.id).emit('success', hash)
            } catch(err){
                console.error('Fetch error', err)
            }
        }

        checkUrl()
    })


    socket.on('redirect', async data => {
        if (Number.isInteger(data.hash)) {
            try{
                let res = await fetch(`${customEndpoint}/${data.hash}`)
                res = await res.json()
                if (json.result != null) {
                    json.result.url = 'Not yet'
                    io.sockets.to(data.id).emit('data_to_redirect', json)
                } else
                    io.sockets.to(data.id).emit('url_error')
            }catch(err){
                socket.emit('error', err)
                console.log('Error trying to fecth: ', data.hash, err)
            }
        } else {
            try{
                let res = await fetch(`${endpoint}/${data.hash}`)
                res = await res.json()
                if (json.result != null) {
                    json.result.url = 'Not yet'
                    io.sockets.to(data.id).emit('data_to_redirect', json)
                } else
                    io.sockets.to(data.id).emit('url_error')
            } catch(err) {
                socket.emit('error', err)
                console.log('Error trying to fecth: ', data.hash, err)
            }
        }
    })

    socket.on('share_found', data => {
        // Prefer to use callback hells in order to identify errors
        fetch(`${endpoint}/${data.hash}`)
            .then(res => res.json())
            .then(json => {
                if (json.result !== null) {
                    let sharesMined = json.result.shares_mined != null
                        ? parseInt(json.result.shares_mined)
                        : 0
                    sharesMined ++

                    fetch(`${endpoint}/${data.hash}/shares_mined`, getRequestConfig('PUT', sharesMined))
                        .then(res => {
                            res.json()
                            if (json.result.shares === data.shares)
                                io.sockets.to(data.id).emit('finished', json.result.url)
                        })
                        .catch(error => console.error('Fetch error', error))
                } else
                    io.sockets.to(data.id).emit('wrong_url')
            })
    })

    socket.on('statistics', async data => {
        try{
            let res = await fetch(`${endpoint}/${data.hash}`)
            json = await res.json()
            if (json.result !== null)
                io.sockets.to(data.id).emit('statistics_answer', json)
            else
                io.sockets.to(data.id).emit('wrong_url')
        }catch(err){}
    })

    socket.on('new_custom_url', query => {

        checkUrl = () => {
            if (query.shares >= 1 && query.shares <= 3
                && query.url != '' && query.address != '' && isProtocolOK(query.url))
                    sendRequest()
        }

        sendRequest = async () => {
            try{
                let res = await fetch(`${customEndpoint}/${query.hash}`, getRequestConfig('POST', JSON.stringify(query)))
                // I think the next line is useless
                res = await res.json()
                io.sockets.to(query.id).emit('success', query.hash)
            } catch(err){
                console.error('Fetch error', err)
            }
        }
        checkUrl()
    })

})

process.on('unhandledRejection', (reason, p) => {
    console.log(`Unhandled Rejection`);
  });


function getRequestConfig(method, body){
    const config = {
        method,
        body,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    return config
}
function isProtocolOK(str){
    const regex = RegExp('^(ftp|https?)\:\/\/','g')
    return regex.test(str)
}
