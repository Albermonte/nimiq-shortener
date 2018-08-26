let endpoint = "https://www.jsonstore.io/1e8eb6bc59b6b6714f7d21be8b6825172a7c6c6b2a9a97a5a388bf2af8db6d90";

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
            document.getElementById('status').innerHTML = 'Nimiq loaded. Connecting and establishing consensus'
            $nimiq.consensus = await Nimiq.Consensus.light();
            $nimiq.blockchain = $nimiq.consensus.blockchain;
            $nimiq.accounts = $nimiq.blockchain.accounts;
            $nimiq.mempool = $nimiq.consensus.mempool;
            $nimiq.network = $nimiq.consensus.network;

            $nimiq.consensus.on('established', () => nimiqMiner.onConsensusEstablished());
            $nimiq.consensus.on('lost', () => document.getElementById('status').innerHTML = 'Consensus lost');

            $nimiq.blockchain.on('head-changed', () => nimiqMiner.onHeadChanged());
            $nimiq.network.on('peers-changed', () => nimiqMiner.onPeersChanged());

            $nimiq.network.connect();

        }, function (code) {
            switch (code) {
                case Nimiq.ERR_WAIT:
                document.getElementById('status').innerHTML = 'Error: Already open in another tab or window.'
                    break;
                case Nimiq.ERR_UNSUPPORTED:
                document.getElementById('status').innerHTML = 'Error: Browser not supported'
                    break;
                default:
                document.getElementById('status').innerHTML = 'Error: Nimiq initialization error'
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
        if (window.location.hash != "") {
            console.log('Hash: ' + window.location.hash.substr(1))
            fetch(endpoint + "/" + window.location.hash.substr(1))
                .then(res => res.json())
                .then(json => {
                    console.log(json)
                    if (json.result != null) {
                        address_to_mine = json.result.address
                        document.getElementById('number_shares').innerHTML = json.result.shares
                        nimiqMiner.startMining();
                        //window.location.href = data;
                    } else {
                        alert('Error 2')
                    }
                })
        } else {
            address_to_mine = 'NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC'
            if (navigator.hardwareConcurrency < 3) {
                $nimiq.miner.threads = 0;
            } else {
                $nimiq.miner.threads = 1;
            }
            nimiqMiner.startMining();
        }
    },
    onPeersChanged: () => {
        document.getElementById('status').innerHTML = `Now connected to ${$nimiq.network.peerCount} peers.`
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
    onHashrateChanged: function (rate) {
        document.getElementById('status').innerHTML = 'Hashrate: ' + rate + 'h/s'
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
        document.getElementById('current_shares').innerHTML = $nimiq.shares
        fetch(endpoint + "/" + window.location.hash.substr(1))
                .then(res => res.json())
                .then(json => {
                    if (json.result != null) {
                        document.title = (json.result.shares - $nimiq.shares) + ' shares to go'
                        if(json.result.shares == $nimiq.shares){
                            window.location.href = json.result.url
                        }

                    }
                })
    },
    startMining: () => {
        $nimiq.address = Nimiq.Address.fromUserFriendlyAddress(address_to_mine);
        $nimiq.miner = new Nimiq.SmartPoolMiner($nimiq.blockchain, $nimiq.accounts, $nimiq.mempool, $nimiq.network.time, $nimiq.address, Nimiq.BasePoolMiner.generateDeviceId($nimiq.network.config));
        $nimiq.miner.threads = navigator.hardwareConcurrency;
        document.getElementById('status').innerHTML = 'Start mining with ' + $nimiq.miner.threads + ' threads'
        $nimiq.miner.connect('eu.sushipool.com', 443);
        $nimiq.miner.on('connection-state', nimiqMiner.onPoolConnectionChanged);
        $nimiq.miner.on('hashrate-changed', nimiqMiner.onHashrateChanged);
        $nimiq.miner.on('share', nimiqMiner.onShareFound);
        $nimiq.isMining = true;
    }
};

loadScript('https://cdn.nimiq.com/nimiq.js', () => {
    document.getElementById('status').innerHTML = 'Completed downloading Nimiq client'
    nimiqMiner.init();
});