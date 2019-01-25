<template>
  <div>
    <transition name="fade" mode="out-in" appear>
      <div :key="actualBite">{{ actualBite }}</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "InfoBitesSlider",
  data() {
    return {
      infoBites: [
        "Blake2b is used for hashing and ed25519 for the signatures.",
        "The Nimiq Mainnet was launched April 14, 2018.",
        "The Nimiq Blockchain uses Non-Interactive Proofs of Proof-of-Work.",
        "Nimiq’s Nano clients require little data and sync fast.",
        "Argon2d is Nimiq’s memory-bound PoW algorithm.",
        "Nimiq uses ed25519 Schnorr signatures.",
        "State is stored in an accounts tree.",
        "Nimiq is written in JS and Rust (latter in progress) and optimized using WebAssembly.",
        "Nimiq is an Inuit word for an object or force that binds things together."
      ],
      actualBite: "",
      biteIndex: 0,
      _isStopped: true
    };
  },
  mounted() {
    this.start();
  },
  methods: {
    start() {
      this._isStopped = false;
      this._run();
    },
    stop() {
      this._isStopped = true;
    },
    _run() {
      if (this._isStopped) return;

      this.biteIndex += 1;
      if (this.biteIndex >= this.infoBites.length) this.biteIndex = 0;

      // 1. Fade out current bite
      //this.$el.style.opacity = "0";

      // 2. Set next bite
      setTimeout(() => {
        this.actualBite = this.infoBites[this.biteIndex];
        console.log(this.biteIndex);
        console.log(this.actualBite);
      }, 500);

      // 3. Trigger next bite
      setTimeout(this._run, 10000);
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.75s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>