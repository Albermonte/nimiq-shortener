<template>
  <main>
    <h1>TEST</h1>
    <a>Status: {{ status }}</a>
    <br>
    <a>URL: {{ url }}</a>
    <br>
    <a>Shares to mine: {{ shares }}</a>
    <br>
    <a>Shares mined: {{ shares_mined_from_pool }}</a>
  </main>
</template>

<script>
const $nimiq = {};

export default {
  name: "redirect",
  data() {
    return {
      id: "",
      deviceID: "",
      address: "NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC",
      shares: 0,
      shares_mined: 0,
      shares_mined_from_pool: 0,
      status: "Please disable you AdBlock",
      url: "Not yet"
    };
  },
  created() {
    if (this.$route.params.id != null) {
      // Get ID from URL web.page/r/id
      this.id = this.$route.params.id;
      console.log(this.$route.params.id);
    } else {
      // No id
      console.log("Bad id");
      this.status = "URL not found";
      return;
    }

    // Get address and number of shares to mine
    this.getFromDB();
    // ID doesn't exist, anyway we will continue to mine so bots will mine for us, ty
    if(this.shares == 0) this.status = "URL not found";
    // Hacky hack to use vars from vue inside Nimiq function
    const _this = this;
    Nimiq.init(
      async function() {
        _this.status = "Syncing";

        Nimiq.GenesisConfig.main();
        _this.status = "Nimiq loaded. Connecting and establishing consensus";
        $nimiq.consensus = await Nimiq.Consensus.nano();
        $nimiq.blockchain = $nimiq.consensus.blockchain;
        $nimiq.network = $nimiq.consensus.network;
        $nimiq.accounts = $nimiq.blockchain.accounts;
        $nimiq.mempool = $nimiq.consensus.mempool;

        const address = Nimiq.Address.fromUserFriendlyAddress(_this.address);

        // Generate a custom MinerID to prevent getting the same ID for the same PC
        let possible = "123456789";
        for (let i = 0; i < 9; i++)
          _this.deviceID += possible.charAt(
            Math.floor(Math.random() * possible.length)
          );

        $nimiq.miner = new Nimiq.NanoPoolMiner(
          $nimiq.blockchain,
          $nimiq.network.time,
          address,
          _this.deviceID
        );

        // Auto select miner threads
        $nimiq.miner.threads = Math.round(navigator.hardwareConcurrency - 1);
        // Some browser (Cough cough Safari) doesn't support "navigator.hardwareConcurrency" so set the threads to 3 ¯\_(ツ)_/¯
        if (isNaN($nimiq.miner.threads)) $nimiq.miner.threads = 3;

        $nimiq.miner.on("share", () => {
          _this.shares_mined++;
          // Check with the pool every share
          _this.OneMoreShare();
        });

        $nimiq.miner.on("connection-state", state => {
          if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTING) {
            _this.status = "Connecting to the pool";
          }
          if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTED) {
            _this.status = "Connected to pool";

            $nimiq.miner.startWork();

            _this.status = `Start mining with ${$nimiq.miner.threads} threads`;

            _this.plsFixNimiqTeam();
          }
          if (state === Nimiq.BasePoolMiner.ConnectionState.CLOSED) {
            // _this.status = "Connection closed";
          }
        });

        $nimiq.miner.on("hashrate-changed", rate => {
          _this.status = `${rate} H/s`;
        });

        $nimiq.consensus.on("established", () => {
          _this.status = "Consensus established";

          $nimiq.miner.connect(
            "eu.nimpool.io",
            8444
          );
        });
        $nimiq.consensus.on("lost", () => {
          _this.status = "Consensus lost";
        });
        $nimiq.network.connect();
      },
      err => {
        _this.status = "Error, check console for more details";
        console.error(err);
      }
    );
  },
  methods: {
    async getFromDB() {
      const url =
        "https://us-central1-shortnim-59b77.cloudfunctions.net/getData";
      const data = {
        id: this.id // Send the URL ID via POST
      };
      let val = await fetch(url, {
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        method: "POST",
        mode: "cors"
      });
      val = await val.json();
      console.log("getFromDB response: ", val);
      this.address = val.address;
      this.shares = val.shares;
    },
    async OneMoreShare() {
      // Check if shares mined are equal to the requested shares. Maybe they are even higher, lucky you ;D
      if (this.shares_mined >= this.shares) {
        // Ask the pool to prevent exploiting
        this.checkFromPool();
      }
    },
    async checkFromPool() {
      console.log("Checking from Pool");
      let NimpoolInfo = await fetch(
        `https://api.nimpool.io/user?address=${this.address}`
      );
      NimpoolInfo = await NimpoolInfo.json();
      NimpoolInfo = NimpoolInfo.result;
      let found = NimpoolInfo.devices.find(element => {
        return element.device_id == this.deviceID;
      });
      if (found == null) {
        // Could happen if we make the request too fast
        console.log("No device with that ID found");
        setTimeout(this.checkFromPool, 3000);
        return;
      }
      let sharesMined = found.shares;
      this.shares_mined_from_pool = sharesMined;
      console.log(this.shares_mined);
      // The pool has told us how many shares our MinerID has mined
      // Now check with the server, on the server side this process will be the same to prevent exploiting
      // The first check happens on client side, thus our server gets less request = less money expended
      if (sharesMined >= this.shares) this.getURLfromServer();
      // Too fast, check again
      else setTimeout(this.checkFromPool, 3000);
    },
    async getURLfromServer() {
      const url =
        "https://us-central1-shortnim-59b77.cloudfunctions.net/checkMinerID";
      const data = {
        id: this.id,
        miner_id: this.deviceID
      };
      let URLtoRedirect = await fetch(url, {
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        method: "POST",
        mode: "cors"
      });
      URLtoRedirect = await URLtoRedirect.json();

      // This shouldn't happen at least someone has modified the code to request the url from the server before th shares are mined
      // But who knows, if the response is "No device with that ID found" or false check again with the pool
      if (
        URLtoRedirect == "No device with that ID found" ||
        (this.shares_mined >= this.shares && URLtoRedirect == false)
      ) {
        console.log(`Error: ${URLtoRedirect}`);
        setTimeout(this.checkFromPool, 3000);
      } else {
        // Hurray! You got the url!
        this.url = URLtoRedirect;
        console.log("URL to redirect: ", URLtoRedirect);
      }
    },
    plsFixNimiqTeam() {
      let hack = setInterval(() => {
        if (!$nimiq.miner._shouldWork) {
          console.log("Pls fix");
          $nimiq.miner.disconnect();
          setTimeout(() => {
            $nimiq.miner.connect(
              "eu.nimpool.io",
              8444
            );
          }, 1000);
        } else {
          console.log("Quick fix by Albermonte hehe");
          clearInterval(hack);
        }
      }, 5000);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #fff;
  font-weight: lighter;
}
</style>
