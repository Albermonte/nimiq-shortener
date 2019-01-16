<template>
  <main>
    <h1>TEST</h1>
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
      shares_mined: 0
    };
  },
  created() {
    if (this.$route.params.id != null) {
      this.id = this.$route.params.id;
      console.log(this.$route.params.id);
    } else {
      console.log("Bad id");
    }

    this.getFromDB();

    const _this = this;
    Nimiq.init(
      async function() {
        _this.status = "Syncing";

        Nimiq.GenesisConfig.main();
        $nimiq.consensus = await Nimiq.Consensus.nano();
        $nimiq.blockchain = $nimiq.consensus.blockchain;
        $nimiq.network = $nimiq.consensus.network;
        $nimiq.accounts = $nimiq.blockchain.accounts;
        $nimiq.mempool = $nimiq.consensus.mempool;

        const address = Nimiq.Address.fromUserFriendlyAddress(_this.address);
        // Maybe generate my own deviceID and not use the Nimiq one because it's the same for the same PC
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
        $nimiq.miner.threads = 2;

        $nimiq.miner.on("share", () => {
          _this.shares_mined++;
          _this.OneMoreShare();
        });

        $nimiq.miner.on("connection-state", state => {
          if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTING) {
            console.log("Connecting to the pool");
          }
          if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTED) {
            console.log("Connected to pool");
            console.log("Mining");

            $nimiq.miner.startWork();

            _this.plsFixNimiqTeam();
          }
          if (state === Nimiq.BasePoolMiner.ConnectionState.CLOSED) {
            console.log("Connection closed");
          }
        });

        $nimiq.miner.on("hashrate-changed", rate => {
          console.log(rate);
        });

        $nimiq.consensus.on("established", () => {
          _this.status = "Established";
          console.log(_this.status);

          $nimiq.miner.connect(
            "eu.nimpool.io",
            8444
          );
        });
        $nimiq.consensus.on("lost", () => {
          _this.status = "Lost";
        });
        $nimiq.network.connect();
      },
      err => {
        console.error(err);
      }
    );
  },
  methods: {
    async getFromDB() {
      const url = "https://us-central1-shortnim-59b77.cloudfunctions.net/getData";
      const data = {
        id: this.id
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
      console.log(`Shares mined: ${this.shares_mined}`)
      if(this.shares_mined >= this.shares){
        const url = "https://us-central1-shortnim-59b77.cloudfunctions.net/checkMinerID";
        const data = {
          id: this.id,
          miner_id: this.deviceID,
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
        if(URLtoRedirect == "No device with that ID found" || this.shares_mined >= this.shares && URLtoRedirect == false) {
          console.log(`Again, URL: ${URLtoRedirect}`)
          setTimeout(this.OneMoreShare(), 2500);}
        else
          console.log("URL to redirect: ", URLtoRedirect)
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
