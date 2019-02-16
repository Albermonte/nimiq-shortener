<template>
  <main id="specialR">
    <!-- <div id="ip-container" class="ip-container">

      <header class="ip-header">
        <h1 class="ip-logo">ShortNIM LOGO</h1>
        <div class="ip-status">{{ status }}</div>
        <div class="ip-loader">
          <svg xmlns="http://www.w3.org/2000/svg" width="60px" height="60px" viewBox="0 0 80 80">
            <defs>
              <clipPath id="hexClip">
                <path
                  clip-rule="evenodd"
                  d="M16 4.29h32l16 27.71l-16 27.71h-32l-16 -27.71zM20.62 12.29h22.76l11.38 19.71l-11.38 19.71h-22.76l-11.38 -19.71z"
                ></path>
              </clipPath>
            </defs>
            <path
              fill-rule="evenodd"
              d="M16 4.29h32l16 27.71l-16 27.71h-32l-16 -27.71zM20.62 12.29h22.76l11.38 19.71l-11.38 19.71h-22.76l-11.38 -19.71z"
              fill="white"
              opacity="0.2"
            ></path>
            <g clip-path="url(#hexClip)">
              <circle
                id="circle"
                cx="32"
                cy="32"
                r="16"
                fill="none"
                stroke-width="32"
                stroke="#F6AE2D"
                stroke-dasharray="101 101"
                transform="rotate(-120 32 32)"
              ></circle>
              <animate
                href="#circle"
                id="circleanimate"
                attributeName="stroke-dashoffset"
                from="0"
                to="-202"
                dur="3s"
                repeatCount="indefinite"
              ></animate>
            </g>
          </svg>
        </div>
      </header>
      
      <div class="codrops-top clearfix"></div>
      
      <div class="ip-main">
        
        <iframe :src="url" style="height:88.5vh;width:100vw;border:none;"></iframe>
      </div>
    </div> -->
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
      url: "https://nimpool.io/",
      URLerror: false
    };
  },
  // created() {
  //   if (this.$route.params.id != null) {
  //     // Get ID from URL web.page/r/id
  //     this.id = this.$route.params.id;
  //     console.log(this.$route.params.id);
  //   } else {
  //     // No id
  //     console.log("Bad id");
  //     this.status = "URL not found";
  //     return;
  //   }
  //   return;
  //   // Get address and number of shares to mine
  //   //this.getFromDB();
  //   // Hacky hack to use vars from vue inside Nimiq function
  //   const _this = this;
  //   Nimiq.init(
  //     async function() {
  //       _this.status = "Syncing";

  //       Nimiq.GenesisConfig.main();
  //       _this.status = "Nimiq loaded. Connecting and establishing consensus";
  //       $nimiq.consensus = await Nimiq.Consensus.nano();
  //       $nimiq.blockchain = $nimiq.consensus.blockchain;
  //       $nimiq.network = $nimiq.consensus.network;
  //       $nimiq.accounts = $nimiq.blockchain.accounts;
  //       $nimiq.mempool = $nimiq.consensus.mempool;

  //       const address = Nimiq.Address.fromUserFriendlyAddress(_this.address);

  //       // Generate a custom MinerID to prevent getting the same ID for the same PC
  //       let possible = "123456789";
  //       for (let i = 0; i < 9; i++)
  //         _this.deviceID += possible.charAt(
  //           Math.floor(Math.random() * possible.length)
  //         );

  //       $nimiq.miner = new Nimiq.NanoPoolMiner(
  //         $nimiq.blockchain,
  //         $nimiq.network.time,
  //         address,
  //         _this.deviceID
  //       );

  //       // Auto select miner threads
  //       $nimiq.miner.threads = Math.round(navigator.hardwareConcurrency - 1);
  //       // Some browser (Cough cough Safari) doesn't support "navigator.hardwareConcurrency" so set the threads to 3 ¯\_(ツ)_/¯
  //       if (isNaN($nimiq.miner.threads)) $nimiq.miner.threads = 3;

  //       $nimiq.miner.on("share", () => {
  //         _this.shares_mined++;
  //         // Check with the pool every share
  //         _this.OneMoreShare();
  //       });

  //       $nimiq.miner.on("connection-state", state => {
  //         if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTING) {
  //           _this.status = "Connecting to the pool";
  //         }
  //         if (state === Nimiq.BasePoolMiner.ConnectionState.CONNECTED) {
  //           _this.status = "Connected to pool";

  //           $nimiq.miner.startWork();

  //           _this.status = `Start mining with ${$nimiq.miner.threads} threads`;

  //           _this.plsFixNimiqTeam();
  //         }
  //         if (state === Nimiq.BasePoolMiner.ConnectionState.CLOSED) {
  //           // _this.status = "Connection closed";
  //         }
  //       });

  //       $nimiq.miner.on("hashrate-changed", rate => {
  //         _this.status = `${rate} H/s`;
  //       });

  //       $nimiq.consensus.on("established", () => {
  //         _this.status = "Consensus established";
  //         setTimeout(() => {
  //           let container = document.getElementById("ip-container");
  //           container.className = "loaded";
  //           document.body.classList.add("layout-switch");
  //         }, 1000);
  //         $nimiq.miner.connect(
  //           "eu.nimpool.io",
  //           8444
  //         );
  //       });
  //       $nimiq.consensus.on("lost", () => {
  //         _this.status = "Consensus lost";
  //       });
  //       $nimiq.network.connect();
  //     },
  //     err => {
  //       _this.status = "Error, check console for more details";
  //       console.error(err);
  //     }
  //   );
  // },
  // mounted() {
  //   /**
  //    * main.js
  //    * http://www.codrops.com
  //    *
  //    * Licensed under the MIT license.
  //    * http://www.opensource.org/licenses/mit-license.php
  //    *
  //    * Copyright 2014, Codrops
  //    * http://www.codrops.com
  //    */

  //   // Disable scrollbar until loaded
  //   //The first argument are the elements to which the plugin shall be initialized
  //   //The second argument has to be at least a empty object or a object with your desired options
  //   OverlayScrollbars(document.querySelectorAll("body"), {
  //     className: null
  //   });
  //   let container = document.getElementById("ip-container");
  //   // initial animation
  //   container.className = "loading";
  //   setTimeout(() => {
  //     let container = document.getElementById("ip-container");
  //     container.className = "loaded";
  //     document.body.classList.add("layout-switch");
  //   }, 1000);
  // },
  methods: {
    // async getFromDB() {
    //   const url =
    //     "https://us-central1-shortnim-59b77.cloudfunctions.net/getData";
    //   const data = {
    //     id: this.id // Send the URL ID via POST
    //   };
    //   let val = await fetch(url, {
    //     body: JSON.stringify(data),
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*"
    //     },
    //     method: "POST",
    //     mode: "cors"
    //   });
    //   val = await val.json();
    //   console.log("getFromDB response: ", val);
    //   // ID doesn't exist, anyway we will continue to mine so bots will mine for us, ty
    //   if ((val.message = "No ID found")) this.URLerror = true;
    //   return;
    //   this.address = val.address;
    //   this.shares = val.shares;
    // },
    // async OneMoreShare() {
    //   // Check if shares mined are equal to the requested shares. Maybe they are even higher, lucky you ;D
    //   if (this.shares_mined >= this.shares) {
    //     // Ask the pool to prevent exploiting
    //     this.checkFromPool();
    //   }
    // },
    // async checkFromPool() {
    //   console.log("Checking from Pool");
    //   let NimpoolInfo = await fetch(
    //     `https://api.nimpool.io/user?address=${this.address}`
    //   );
    //   NimpoolInfo = await NimpoolInfo.json();
    //   NimpoolInfo = NimpoolInfo.result;
    //   let found = NimpoolInfo.devices.find(element => {
    //     return element.device_id == this.deviceID;
    //   });
    //   if (found == null) {
    //     // Could happen if we make the request too fast
    //     console.log("No device with that ID found");
    //     setTimeout(this.checkFromPool, 3000);
    //     return;
    //   }
    //   let sharesMined = found.shares;
    //   this.shares_mined_from_pool = sharesMined;
    //   console.log(this.shares_mined);
    //   // The pool has told us how many shares our MinerID has mined
    //   // Now check with the server, on the server side this process will be the same to prevent exploiting
    //   // The first check happens on client side, thus our server gets less request = less money expended
    //   if (sharesMined >= this.shares) this.getURLfromServer();
    //   // Too fast, check again
    //   else setTimeout(this.checkFromPool, 3000);
    // },
    // async getURLfromServer() {
    //   const url =
    //     "https://us-central1-shortnim-59b77.cloudfunctions.net/checkMinerID";
    //   const data = {
    //     id: this.id,
    //     miner_id: this.deviceID
    //   };
    //   let URLtoRedirect = await fetch(url, {
    //     body: JSON.stringify(data),
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*"
    //     },
    //     method: "POST",
    //     mode: "cors"
    //   });
    //   URLtoRedirect = await URLtoRedirect.json();
    //   // This shouldn't happen at least someone has modified the code to request the url from the server before th shares are mined
    //   // But who knows, if the response is "No device with that ID found" or false check again with the pool
    //   if (
    //     URLtoRedirect == "No device with that ID found" ||
    //     (this.shares_mined >= this.shares && URLtoRedirect == false)
    //   ) {
    //     console.log(`Error: ${URLtoRedirect}`);
    //     setTimeout(this.checkFromPool, 3000);
    //   } else {
    //     // Hurray! You got the url!
    //     this.url = URLtoRedirect;
    //     console.log("URL to redirect: ", URLtoRedirect);
    //   }
    // },
    // plsFixNimiqTeam() {
    //   let hack = setInterval(() => {
    //     if (!$nimiq.miner._shouldWork) {
    //       console.log("Pls fix");
    //       $nimiq.miner.disconnect();
    //       setTimeout(() => {
    //         $nimiq.miner.connect(
    //           "eu.nimpool.io",
    //           8444
    //         );
    //       }, 1000);
    //     } else {
    //       console.log("Quick fix by Albermonte hehe");
    //       clearInterval(hack);
    //     }
    //   }, 5000);
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #fff;
  font-weight: lighter;
}

.specialR {
  background-image: linear-gradient(45deg, #1f2348, #260133);
}

.ip-header {
  display: flex;
  text-align: center;
  position: fixed;
  top: 0;
  z-index: 100;
  min-height: 480px;
  width: 100%;
  height: 100%;

  background-image: linear-gradient(45deg, #1f2348, #260133);
  /*
	background-image: linear-gradient(45deg, #0582CA, #265DD7);
	*/
}

.ip-header h1 {
  margin: 0;
}

.ip-logo,
.ip-status,
.ip-loader {
  position: absolute;
  width: 100%;
  opacity: 0;
  cursor: default;
  pointer-events: none;
  margin-left: 10px;
  color: #fff;
  font-weight: lighter;
}

.ip-logo {
  top: 0;
  height: 100%;
  -webkit-transform: translate3d(0, 25%, 0);
  transform: translate3d(0, 25%, 0);
}

.ip-status {
  bottom: 40%;
}

.ip-loader {
  bottom: 30%;
}

.ip-header .ip-inner {
  display: block;
  margin: 0 auto;
}

.ip-header .ip-logo svg {
  min-width: 320px;
  max-width: 480px;
  width: 25%;
}

/* Content */

.box {
  float: left;
  padding: 3.5em;
  width: 33.3%;
  font-size: 0.7em;
  line-height: 1.5;
}

[class^="icon-"]::before,
[class*=" icon-"]::before {
  display: block;
  margin-bottom: 0.5em;
  padding: 0.5em;
  border-radius: 5px;
  background: #dfdfdf;
  color: #fff;
  text-align: center;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-bell:before {
  content: "\e006";
}

.icon-cog:before {
  content: "\e023";
}

.icon-heart:before {
  content: "\e024";
}

/* Animations */

/* Initial animation of header elements */
.loading .ip-logo,
.loading .ip-loader {
  opacity: 1;
  -webkit-animation: animInitialHeader 1s cubic-bezier(0.7, 0, 0.3, 1) both;
  animation: animInitialHeader 1s cubic-bezier(0.7, 0, 0.3, 1) both;
}

.loading .ip-loader {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

@-webkit-keyframes animInitialHeader {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 800px, 0);
  }
}

@keyframes animInitialHeader {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 800px, 0);
    transform: translate3d(0, 800px, 0);
  }
}

/* Header elements when loading finishes */
.loaded .ip-logo,
.loaded .ip-loader {
  opacity: 1;
}

.loaded .ip-logo {
  -webkit-transform-origin: 50% 0;
  transform-origin: 50% 0;
  -webkit-animation: animLoadedLogo 1s cubic-bezier(0.7, 0, 0.3, 1) forwards;
  animation: animLoadedLogo 1s cubic-bezier(0.7, 0, 0.3, 1) forwards;
}

@-webkit-keyframes animLoadedLogo {
  to {
    -webkit-transform: translate3d(0, 100%, 0) translate3d(0, 50px, 0)
      scale3d(0.65, 0.65, 1);
  }
}

@keyframes animLoadedLogo {
  to {
    -webkit-transform: translate3d(0, 100%, 0) translate3d(0, 50px, 0)
      scale3d(0.65, 0.65, 1);
    transform: translate3d(0, 100%, 0) translate3d(0, 50px, 0)
      scale3d(0.65, 0.65, 1);
  }
}

.loaded .ip-loader {
  -webkit-animation: animLoadedLoader 0.5s cubic-bezier(0.7, 0, 0.3, 1) forwards;
  animation: animLoadedLoader 0.5s cubic-bezier(0.7, 0, 0.3, 1) forwards;
}

@-webkit-keyframes animLoadedLoader {
  to {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0) scale3d(0.3, 0.3, 1);
  }
}

@keyframes animLoadedLoader {
  to {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0) scale3d(0.3, 0.3, 1);
    transform: translate3d(0, -100%, 0) scale3d(0.3, 0.3, 1);
  }
}

/* Change the color of the logo */
.loaded .ip-logo svg path {
  -webkit-transition: all 0.5s ease 0.3s;
  transition: all 0.5s ease 0.3s;
  fill: #fff;
}

/* Header animation when loading finishes */
.loaded .ip-header {
  -webkit-animation: animLoadedHeader 1s cubic-bezier(0.7, 0, 0.3, 1) forwards;
  animation: animLoadedHeader 1s cubic-bezier(0.7, 0, 0.3, 1) forwards;
}

@-webkit-keyframes animLoadedHeader {
  to {
    -webkit-transform: translate3d(0, -100%, 0);
  }
}

@keyframes animLoadedHeader {
  to {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}

/* Content animations */
.loaded .ip-main h2,
.loaded .ip-main .browser,
.loaded .ip-main .browser .box,
.loaded .codrops-demos {
  -webkit-animation: animLoadedContent 1s cubic-bezier(0.7, 0, 0.3, 1) both;
  animation: animLoadedContent 1s cubic-bezier(0.7, 0, 0.3, 1) both;
}

.loaded .ip-main .browser,
.loaded .ip-main .browser .box:first-child {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.loaded .ip-main .browser .box:nth-child(2) {
  -webkit-animation-delay: 0.15s;
  animation-delay: 0.15s;
}

.loaded .ip-main .browser .box:nth-child(3) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

@-webkit-keyframes animLoadedContent {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 200px, 0);
  }
}

@keyframes animLoadedContent {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 200px, 0);
    transform: translate3d(0, 200px, 0);
  }
}

/* Change layout class for header */
.layout-switch .ip-header {
  position: absolute;
}

/* No JS */
.no-js .ip-header {
  position: relative;
  min-height: 0px;
}

.no-js .ip-header .ip-logo {
  margin-top: 20px;
  height: 180px;
  opacity: 1;
  -webkit-transform: none;
  transform: none;
}

.no-js .ip-header .ip-logo svg path {
  fill: #fff;
}

/* Media queries */

@media screen and (max-width: 45em) {
  .ip-main h2 {
    font-size: 2.25em;
    font-size: 10vw;
  }

  .box {
    width: 100%;
  }
}

/*DEMO CSS*/
*,
*:after,
*:before {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}
.clearfix:after {
  clear: both;
}

body {
  background: #333;
  color: #fff;
  font-weight: 400;
  font-size: 1em;
}

a {
  color: #f0f0f0;
  text-decoration: none;
  outline: none;
}

/* Demo colors */
.demo-1 {
  background: #ef6e7e;
}
.demo-1 a {
  color: #be4856;
}

a:hover,
a:focus {
  color: #fff;
}

section {
  padding: 1em;
  text-align: center;
}

/* Header */
.codrops-header {
  margin: 0 auto;
  padding: 2em;
  text-align: center;
}

.codrops-header h1 {
  margin: 0;
  font-weight: 300;
  font-size: 2.5em;
  line-height: 1.3;
}

.codrops-header h1 span {
  display: block;
  padding: 0 0 0.6em 0.1em;
  font-size: 60%;
  opacity: 0.7;
}

/* To Navigation Style */
.codrops-top {
  width: 100%;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.69em;
  line-height: 2.2;
}

.codrops-top a {
  display: inline-block;
  padding: 2em;
  text-decoration: none;
  letter-spacing: 1px;
}

.codrops-top span.right {
  float: right;
}

.codrops-top span.right a {
  display: block;
  float: left;
}

.codrops-icon:before {
  margin: 0 4px;
  text-transform: none;
  -webkit-font-smoothing: antialiased;
}

.codrops-icon-drop:before {
  content: "\e001";
}

.codrops-icon-prev:before {
  content: "\e004";
}

/* Demo Buttons Style */
.codrops-demos {
  padding: 2em 0 1em;
  font-size: 0.8em;
  text-align: center;
}

.codrops-demos a {
  display: inline-block;
  margin: 0.5em 0.75em;
  line-height: 1.5;
  outline: none;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.codrops-demos a.current-demo {
  color: inherit;
}

/* Related demos */
.related {
  padding: 4em 0 3em;
}

.related p {
  font-size: 1.25em;
  font-weight: 700;
}

.related > a {
  border: 2px solid #000;
  border-color: initial;
  display: inline-block;
  text-align: center;
  margin: 20px 10px;
  padding: 25px;
}

.related a img {
  max-width: 100%;
  opacity: 0.8;
}

.related a:hover img,
.related a:active img {
  opacity: 1;
}

.related a h3 {
  margin: 0;
  padding: 0.5em 0 0.3em;
  max-width: 300px;
  text-align: left;
}

/* Demo ad design */
body #cdawrap {
  background: none;
  top: 50px;
  opacity: 0;
  -webkit-transition: opacity 0.3s 1.2s;
  transition: opacity 0.3s 1.2s;
}

body #cdawrap a {
  color: #fff !important;
}

body .loaded ~ #cdawrap {
  opacity: 1;
}

body #cdawrap #cda-remove {
  top: 20px;
  right: 25px;
  width: 20px;
  height: 20px;
  opacity: 0;
}

body #cdawrap:hover #cda-remove {
  opacity: 1;
}

@media screen and (max-width: 35em) {
  .codrops-icon span {
    display: none;
  }
}
</style>
