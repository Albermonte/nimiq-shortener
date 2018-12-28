<template>
  <main>
    <h1>Short your URL and earn NIM</h1>
    <section>
      <form id="form" @submit.prevent="writeUserData">
        <div class="url-input">
          <input
            type="text"
            v-validate="'required|url'"
            name="url"
            placeholder="Place your long url here"
            spellcheck="false"
            v-model="url"
          >
        </div>
        <span>{{ errors.first('url') }}</span>
        <div class="row" v-if="url !== '' && !errors.has('url')">
          <div class="nimiq-address">
            <h5>nimiq address</h5>
            <div class="nimiq-address__input">
              <i class="fas fa-address-card"></i>
              <input
                type="text"
                v-model="address"
                placeholder="NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC"
                spellcheck="false"
              >
            </div>
          </div>
          <div class="nimiq-shares">
            <h5>Shares to mine</h5>
            <div class="nimiq-shares__input">
              <i class="fas fa-hand-holding-usd"></i>
              <input v-model="shares" type="number" placeholder="1" min="1" max="3">
            </div>
          </div>
        </div>
        <input type="submit" class="nq-button light-blue blue-button" value="SHORT IT!">
      </form>
    </section>
  </main>
</template>

<script>
export default {
  name: "ShortForm",
  data() {
    return {
      url: "",
      address: "",
      shares: 1
    };
  },
  methods: {
    writeUserData() {
      firebase.database()
        .ref(123)
        .set({
          url: this.url,
          address: this.address,
          shares: this.shares
        });
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
section {
  background: #fff;
  padding: 25px 100px;
  width: 95vw;
  margin: 0 auto;
  max-width: 850px;
  box-shadow: 0 13px 0px -10px rgba(255, 255, 255, 0.2),
    0 26px 0px -20px rgba(255, 255, 255, 0.2), 0 10px 200px rgba(0, 0, 0, 0.15);
}
input {
  width: 100%;
}

.url-input,
.nimiq-shares__input,
.nimiq-address__input {
  display: flex;
  align-items: center;
  border-radius: 5px;
}
.url-input {
  display: flex;
  align-items: center;
  padding: 10px 20px;
}
.url-input input {
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

.url-input .link-icon {
  font-size: 20px;
}

.nimiq-shares__input input,
.nimiq-address__input input {
  padding: 0 10px;
  border: 0;
  font-size: 1.1em;
  background: #fff;
  height: 30px;
  color: #293441;
  border-radius: 2px;
  outline: none;
}
.nimiq-shares__input i,
.nimiq-address__input i {
  margin-left: 10px;
}

.nimiq-shares input {
  text-align: center;
  max-width: 85px;
}
h5 {
  margin-top: 25px;
  margin-bottom: 5px;
  text-align: left;
  text-transform: uppercase;
  font-size: 11px;
  margin-left: 38px;
}
.row {
  display: flex;
  justify-content: space-between;
}
.nimiq-address {
  flex: 1;
  margin-right: 20px;
}

.blue-button {
  margin-top: 25px;
  width: 30%;
  font-size: 16px;
  font-weight: bold;
  height: 43px;
  /*
  background: linear-gradient(120deg,#0582CA, #265DD7);
  border: 0;
  border-radius: 100px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15) !important;
  color: #fff;
  cursor: pointer; */
}

@media screen and (max-width: 992px) {
  h1 {
    font-size: 25px;
  }
  .url-input input {
    font-size: 1.1em;
  }
  section {
    padding: 15px;
    width: calc(100% - 60px);
  }
  .row {
    flex-direction: column;
  }
}
</style>