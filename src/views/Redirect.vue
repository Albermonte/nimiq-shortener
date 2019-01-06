<template>
  <main>
    <h1>TEST</h1>
  </main>
</template>

<script>
//import { namesRef } from "../firebase.js";

const $nimiq = {};

export default {
  name: "redirect",
  data() {
    return {
      id: ""
    };
  },
  mounted() {
    console.log("mounted");
    if (this.$route.params.id != null) {
      console.log(this.$route.params.id);
    } else {
      console.log("Bad id");
    }
    const vm = this;
    // setInterval(() => {
    //   if ($nimiq && $nimiq.miner) {
    //     vm.hashrate = $nimiq.miner._hashrate.toString();
    //     vm.height = $nimiq.blockchain.height.toString();
    //   }
    // }, 1000);
    // setTimeout(() => {
    //   if (!vm.firstExpand) {
    //     vm.expanded = true;
    //   }
    // }, 5000);
    Nimiq.init(
      async function() {
        vm.status = "Syncing";
        Nimiq.GenesisConfig.main();
        $nimiq.consensus = await Nimiq.Consensus.nano();
        $nimiq.blockchain = $nimiq.consensus.blockchain;
        $nimiq.network = $nimiq.consensus.network;
        $nimiq.accounts = $nimiq.blockchain.accounts;
        $nimiq.mempool = $nimiq.consensus.mempool;
        const address = Nimiq.Address.fromUserFriendlyAddress(
          "NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC"
        );
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

        $nimiq.miner.on("connection-state", () => {});
        $nimiq.consensus.on("established", () => {
          vm.status = "Established";
          console.log(vm.status);

          $nimiq.miner.connect(
            "eu.nimpool.io",
            8444
          );
          console.log("Mining");
          $nimiq.miner.startWork();
          setInterval(
            console.log("Hashrate: " + $nimiq.miner._hashrate.toString()),
            350
          );
        });
        $nimiq.consensus.on("lost", () => {
          vm.status = "Lost";
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
    namesRef.child(customID).once("value", function(data) {
        if (data.val() == null) {
          _this.submitID(customID);
          console.log("Done");
        } else {
          console.log("Again");
          _this.generateID();
        }
      });
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
