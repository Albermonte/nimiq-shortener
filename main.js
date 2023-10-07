require('dotenv').config()

const express = require('express');
const app = express();
const PORT = 8080;
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');

const { Deta } = require("deta")
const deta = Deta(process.env.DETA_PROJECT_KEY)
const db = deta.Base("shortened_urls")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/', express.static(__dirname + '/public', {
    extensions: ['html']
}));

app.post('/new_url', (req, resp) => {
    let query = req.body;

    checkURL = () => {
        if (query.shares >= 1) {
            let protocol_ok = query.url.startsWith("http://") || query.url.startsWith("https://") || query.url.startsWith("ftp://");
            if (query.url != '' && query.address != '' && protocol_ok) {
                getRandom();
            }
        }
    };

    getRandom = async () => {
        let hash = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            hash += possible.charAt(Math.floor(Math.random() * possible.length));

        try {
            await db.insert({ ...query }, hash)
            resp.send({ success: true, hash });
        } catch (e) {
            console.log(e);
            getRandom();
        }
    };

    checkURL();
});

app.post('/redirect', async (req, resp) => {
    const data = req.body;
    try {
        const item = await db.get(data.hash);
        if (process.env.SKIP_MINING) resp.send({ success: true, data_to_redirect: { ...item, shares: 0 } });
        if (item) {
            resp.send({ success: true, data_to_redirect: { ...item, url: 'Not yet' } });
        } else {
            resp.send({ success: false, error: 'Error trying to fecth: ' + data.hash });
            console.log('Error trying to fecth: ', data.hash);
        }
    } catch (e) {
        console.log(e);
        resp.send({ success: false, error });
        console.log('Error trying to fecth: ', data.hash);
    }
});

app.post('/share_found', async (req, resp) => {
    const data = req.body;
    try {
        await db.update({ shares_mined: db.util.increment(1) }, data.hash);
        const item = await db.get(data.hash);
        if (item) {
            if (Number(data.shares) >= Number(item.shares)) {
                resp.send({ success: true, url: item.url });
            }
        }
    } catch (e) {
        console.log(e);
        resp.send({ success: false, error: 'wrong_url' });
    }
});

app.get('/statistics/:hash', async (req, resp) => {
    const data = req.params;
    try {
        const item = await db.get(data.hash)
        resp.send({ success: true, statistics_answer: item });
    } catch (error) {
        console.log(error);
        resp.send({ success: false, error: 'wrong_url' });
    }
});


server.listen(PORT, () => {
    console.log('Server started: http://localhost:' + PORT);
});

process.on('unhandledRejection', (reason, p) => {
    console.log(`Unhandled Rejection ${reason}`);
});