<template>
  <main>
    <h1>
      Short your URL and earn NIM
    </h1>
    <section>
      <div class="url-input">
        <input type="text" placeholder="Place your long url" spellcheck="false" v-model="url">
      </div>
      <div class="row"  v-if="url !== ''">
        <div class="nimiq-address">
          <h5>nimiq address</h5>
          <div class="nimiq-address__input">
            <i class="fas fa-address-card"></i>
            <input type="text" v-model="address" placeholder="1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX" spellcheck="false">
          </div>
        </div>
        <div class="nimiq-shares">
          <h5>Shares to mine</h5>
          <div class="nimiq-shares__input">
            <i class="fas fa-hand-holding-usd"></i>
            <input v-model="shares" type="number" placeholder="2" min="1" max="3">
          </div>
        </div>
      </div>
      <button type="submit">SHORT IT!</button>
    </section>
  </main>
</template>

<script>
  export default {
    name: "ShortForm",
    data(){
      return{
        url:'',
        address:'',
        shares:1
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1{
  color: #fff;
  font-weight: lighter;
}
section{
  background: #fff;
  padding: 25px 100px;
  width: 95vw;
  margin: 0 auto;
  max-width: 850px;
  box-shadow: 0 13px 0px -10px rgba(255, 255, 255, 0.2), 0 26px 0px -20px rgba(255, 255, 255, 0.2), 0 10px 200px rgba(0, 0, 0, 0.15);
}
input{
  width: 100%;
}

.url-input,.nimiq-shares__input,.nimiq-address__input{
  display: flex;
  align-items: center;
  border-radius: 5px;
}
.url-input{
  display: flex;
  align-items: center;
  padding: 10px 20px;
}
.url-input input{
  padding: 0 10px;
  border: 0;
  font-size: 1.5em;
  background: #fff;
  height: 43px;
  color: #293441;
  border-radius: 2px;
  outline: none;
      text-align: center;
    border-bottom: 1px solid;
}

.url-input .link-icon{
  font-size: 20px;
}

.nimiq-shares__input input,.nimiq-address__input input{
  padding: 0 10px;
  border: 0;
  font-size: 1.1em;
  background: #fff;
  height: 30px;
  color: #293441;
  border-radius: 2px;
  outline: none;
}
.nimiq-shares__input i,.nimiq-address__input i{
  margin-left: 10px;
}

.nimiq-shares input{
  text-align: center;
  max-width: 85px;
}
h5{
  margin-top: 25px;
  margin-bottom: 5px;
  text-align: left;
  text-transform: uppercase;
  font-size: 11px;
  margin-left: 35px;
}
.row{
  display: flex;
  justify-content: space-between;
}
.nimiq-address{
  flex:1;
  margin-right: 20px;
}

button {
  margin-top: 25px;
  padding: 5px 70px;
  font-size: 16px;
  font-weight: bold;
  height: 43px;
  background: linear-gradient(120deg,#0582CA, #265DD7);
  border: 0;
  border-radius: 100px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15) !important;
  color: #fff;
  cursor: pointer;
}

@media screen and (max-width:992px){
  h1{
    font-size: 25px;
  }
  .url-input input{
    font-size: 1.1em;
  }
  section{
   padding: 15px;
   width: calc(100% - 60px);
  }
  .row{
    flex-direction: column;
  }
}
</style>