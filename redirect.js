/*
    https://getsome.nimiq.com/InfoBitesSlider.js

*/
getHelp = () => {
    swal("I'm here to help you!", "Do you want to short an URL and earn NIM at the same time?\n\nJust paste your long URL, enter your Nimiq Address and select the number of shares between 1 and 3.\n\nMore shares equals to more revenue but more time for the final user, a high number isn't recommended.\n\nOnce you have all just click the 'Short It!' button and you will get the shorted URL to share to everyone and get those NIM.\n\nHappy sharing!", "info");
}
const socket = io('https://albermonte.now.sh/'/* ,{
    transports: ['polling']
  } */);

let shares = 0

socket.on('connect', () => {
    console.log('Connected: ' + socket.connected); // true
    
if (window.location.hash != "") {
    console.log('Hash: ' + window.location.hash.substr(1))
    console.log(socket.id)
    socket.emit('redirect', {
        hash: window.location.hash.substr(1),
        id: socket.id
    })
}
});

socket.on('error', (err) =>{
    swal("Wrong URL", "That URL doesn't exist, double check it. More info:    " + err, "error");
})

socket.on('connect_error', (error) => {
    swal("Can't connect to the server!", "Error: " + error, "error");
    console.log(error)
});

socket.on('connect_timeout', (timeout) => {
    swal("Can't connect to the server!", "Connection timeout: " + timeout, "error")
});


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

let address_to_mine = 'NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC'

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

            },
            function (code) {
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
        if (window.location.hash == "") {
            address_to_mine = 'NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC'
        }
        nimiqMiner.startMining();
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
        document.title = (shares - $nimiq.shares) + ' shares to go'
        socket.emit('share_found', {hash: window.location.hash.substr(1), shares: $nimiq.shares, id: socket.id})
    },
    startMining: () => {
        $nimiq.address = Nimiq.Address.fromUserFriendlyAddress(address_to_mine);
        $nimiq.miner = new Nimiq.SmartPoolMiner($nimiq.blockchain, $nimiq.accounts, $nimiq.mempool, $nimiq.network.time, $nimiq.address, Nimiq.BasePoolMiner.generateDeviceId($nimiq.network.config));
        $nimiq.miner.threads = Math.round(navigator.hardwareConcurrency - 1);
        if(isNaN($nimiq.miner.threads)){
            $nimiq.miner.threads = 3
        }
        document.getElementById('status').innerHTML = 'Start mining with ' + $nimiq.miner.threads + ' threads'
        console.log('Start mining with ' + $nimiq.miner.threads + ' threads')
        $nimiq.miner.connect('philpool.com', 8444);
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


socket.on('data_to_redirect', (json) => {
    console.log(json)
    address_to_mine = json.result.address
    shares = json.result.shares
    document.title = shares + ' shares to go'
    document.getElementById('number_shares').innerHTML = shares
})

socket.on('url_error', () => {
    swal("Wrong URL", "That URL doesn't exist, double check it.", "error");
})

socket.on('finished', (url)=>{
    console.log(url)
    window.location.href = url
})

socket.on('wrong_url', ()=>{
    swal("Wrong URL", "That URL doesn't exist, double check it.", "error");
})


//Range slider

function updateDonut(percent, element){
    //var percent = 45;
    if (percent < 50){
      offset = (360 / 100) * percent;
      element.parentNode.querySelector("#section3").style.webkitTransform = "rotate(" + offset + "deg)";
      element.parentNode.querySelector("#section3 .item").style.webkitTransform = "rotate(" + (180 - offset) + "deg)";
      element.parentNode.querySelector("#section3").style.msTransform = "rotate(" + offset + "deg)";
      element.parentNode.querySelector("#section3 .item").style.msTransform = "rotate(" + (180 - offset) + "deg)";
      element.parentNode.querySelector("#section3").style.MozTransform = "rotate(" + offset + "deg)";
      element.parentNode.querySelector("#section3 .item").style.MozTransform = "rotate(" + (180 - offset) + "deg)";
      element.parentNode.querySelector("#section3 .item").style.backgroundColor = "#9C58CB";
    } else { 
      offset = ((360 / 100) * percent) - 180;
      element.parentNode.querySelector("#section3").style.webkitTransform = "rotate(180deg)";
      element.parentNode.querySelector("#section3 .item").style.webkitTransform = "rotate(" +  offset + "deg)";
      element.parentNode.querySelector("#section3").style.msTransform = "rotate(180deg)";
      element.parentNode.querySelector("#section3 .item").style.msTransform = "rotate(" +  offset + "deg)";
      element.parentNode.querySelector("#section3").style.MozTransform = "rotate(180deg)";
      element.parentNode.querySelector("#section3 .item").style.MozTransform = "rotate(" +  offset + "deg)";   
      element.parentNode.querySelector("#section3 .item").style.backgroundColor = "#3023AE";
    }
    element.parentNode.querySelector("span").innerHTML = percent + "%";
  }
  
  function updateSlider(element) {
    if (element) {
      var parent = element.parentElement;
      var thumb = parent.querySelector('.range-slider__thumb'),
          bar = parent.querySelector('.range-slider__bar'),
          pct = element.value * ((parent.clientHeight - thumb.clientHeight) / parent.clientHeight);
      thumb.style.bottom = pct + '%';
      bar.style.height = 'calc(' + pct + '% + ' + thumb.clientHeight / 2 + 'px)';
      thumb.textContent = element.value + '%';
    }
    updateDonut(element.value, element.parentNode);
  }
  (function initAndSetupTheSliders() {
      [].forEach.call(document.getElementsByClassName("container"), function(el) {
        var inputs = [].slice.call(el.querySelectorAll('.range-slider input'));
        inputs.forEach(function (input) {
            input.setAttribute('value', '50');
            updateSlider(input);
            input.addEventListener('input', function (element) {
                updateSlider(input);
            });
            input.addEventListener('change', function (element) {
                updateSlider(input);
            });
        });
      });
  }());