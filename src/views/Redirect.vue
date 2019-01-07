<template>
  <main>
    <h1>TEST</h1>
  </main>
</template>

<script>
import { namesRef } from "../firebase.js";

const $nimiq = {};

export default {
  name: "redirect",
  data() {
    return {
      id: "",
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

    this.getFromDB("address");
    this.getFromDB("shares");

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
        const deviceId = Nimiq.BasePoolMiner.generateDeviceId(
          $nimiq.network.config
        );

        $nimiq.miner = new Nimiq.NanoPoolMiner(
          $nimiq.blockchain,
          $nimiq.network.time,
          address,
          deviceId
        );
        $nimiq.miner.threads = 2;

        $nimiq.miner.on("share", () => {
          _this.shares_mined++;
          console.log(`Shares mined: ${_this.shares_mined}`);
          _this.OneMoreShare();

          if (_this.shares_mined >= _this.shares) {
            _this.getFromDB("url");
          }
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
    getFromDB(here) {
      let _this = this;
      let val = null;
      namesRef.child(`${this.id}/${here}`).once("value", function(data) {
        if (data.val() == null) {
          console.log("Can't find ID for " + here);
        } else {
          switch (here) {
            case "address":
              _this.address = data.val();
              break;
            case "url":
              window.location.href = data.val();
              //https://api.nimpool.io/user?address=NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC
              //https://firebase.google.com/docs/functions/callable?hl=es-419
              //https://blog.usejournal.com/build-a-serverless-full-stack-app-using-firebase-cloud-functions-81afe34a64fc
              break;
            case "shares":
              _this.shares = data.val();
              break;
            case "shares_mined":
              val = data.val();
              break;
          }
        }
      });
      return val;
    },
    OneMoreShare() {
      let shares = this.getFromDB("shares_mined");
      shares++;
      namesRef.child(`${this.id}`).update({
        shares_mined: shares
      });
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
      }, 3000);
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
