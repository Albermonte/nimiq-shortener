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
      shares: 0
    };
  },
  mounted() {
    if (this.$route.params.id != null) {
      this.id = this.$route.params.id;
      console.log(this.$route.params.id);
    } else {
      console.log("Bad id");
    }

    namesRef.child(`${this.id}/address`).once("value", function(data) {
      if (data.val() == null) {
        console.log("Can't find ID");
      } else {
        this.address = data.val();
      }
    });
    namesRef.child(`${this.id}/shares`).once("value", function(data) {
      if (data.val() == null) {
        console.log("Can't find ID");
      } else {
        this.shares = data.val();
      }
    });

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
        $nimiq.miner.threads = 1;

        $nimiq.miner.on("share", () => {
          _this.shares_mined++;
          console.log(_this.shares_mined)
          namesRef
            .child(`${this.id}/shares_mined`)
            .once("value", function(data) {
              let shares = data.val();
              shares++
              namesRef.child(`${this.id}`).set({
                shares_mined: shares
              });
            });

          if (_this.shares_mined >= _this.shares) {
            namesRef.child(`${this.id}/url`).once("value", function(data) {
              if (data.val() == null) {
                console.log("Can't find ID");
              } else {
                window.location.href = data.val();
              }
            });
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
            let hack = setInterval(() => {
              if (!$nimiq.miner._shouldWork) {
                console.log("Pls fix")
                $nimiq.miner.disconnect();
                setTimeout(() => {
                  $nimiq.miner.connect(
                    "eu.nimpool.io",
                    8444
                  );
                }, 1000);
              }else{
                clearInterval(hack)
              }
            }, 3000);
            
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
    /*
     */
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
