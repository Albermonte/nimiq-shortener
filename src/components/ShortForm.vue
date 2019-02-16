<template>
  <main>
    <h1>Short your URL and earn NIM</h1>
    <section class="section">
      <form @submit.prevent="checkForm">
        <div class="">
          <div class="">
            <b-field :type="{'is-danger': errors.has('url')}" :message="errors.first('url')">
              <b-input type="text" v-validate="'required|url'" name="url" placeholder="Paste a long url" spellcheck="false" v-model="url"
                  icon-pack="fas"
                  icon="link">
              </b-input>
            </b-field> 
            <button class="" v-if="CopyButton" v-on:click="CopyURL" type="button">{{ button }}</button>
            <button class="" v-else type="submit">SHORT IT!</button>
          </div>
          <div class="" v-if="url !== '' && !errors.has('url') && !hide">
            <b-field label="Nimiq Address" :type="{'is-danger': errors.has('address')}" :message="errors.first('address')">
                <b-input 
                  icon-pack="fas"
                  icon="address-card"
                  type="text" v-model="address" placeholder="NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC" spellcheck="false" v-validate="'required|address'" name="address" ></b-input>
            </b-field>
            <b-field label="Shares to mine" :type="{'is-danger': errors.has('shares')}" :message="errors.first('shares')">
                <b-input 
                  icon-pack="fas"
                  icon="hand-holding-usd" 
                  v-model="shares" type="number" placeholder="1" min="1" max="3" v-validate="'required|min:1|max:3'" name="shares" ></b-input>
            </b-field>
          </div>
        </div>
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
      shares: 1,
      shares_mined: 0,
      hide: false,
      CopyButton: false,
      button: "COPY!"
    };
  },
  methods: {
    checkForm() {
      // Check all the inputs seems correct
      this.$validator.validateAll().then(result => {
        if (result) this.submit();
        else console.log("Bad data");
      });
    },
    async submit() {
      const url =
        "https://us-central1-shortnim-59b77.cloudfunctions.net/shortURL";
      /*  
      url: data.url,
      address: data.address,
      shares: data.shares
      */
      const data = {
        url: this.url,
        address: this.address,
        shares: this.shares
      };

      // Send the inputs to the server to store it on the DB
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
      console.log("submit response: ", val);
      // Get the current web page with port (if different from :80)
      //Add the returned ID assigned to the long URL
      this.url = `${window.location.origin}/r/${val}`;
      // Hide the address and shares input
      this.hide = true;
      // Shows the Copy button, hide the Short It button
      this.CopyButton = true;
    },
    CopyURL() {
      const _this = this;

      // Copy the shorted URL to the clipboard
      this.$copyText(this.url).then(
        function(e) {
          // Change text of button from Copy to Copied
          _this.button = "COPIED";
          console.log(e);
        },
        function(e) {
          alert("Can not copy");
          console.log(e);
        }
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--
<style scoped lang="scss">
h1 {
  color: #fff;
  font-weight: lighter;
}

.blue-button {
  height: 3rem;
  text-decoration: none;
  font-weight: bold !important;
  letter-spacing: 1.5px;
  padding: 0 1.5rem;
  background-color: rgba(31, 35, 72, 0.07);
  border-radius: 1.5rem;
  opacity: 1 !important;
  transition: color 150ms, background-color 150ms;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 14px 1.5rem;
  color: #1f2348;
  text-transform: uppercase;

  &:hover {
    background-color: var(--nimiq-light-blue);
  }
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-form .main-button {
  background: rgba(31, 35, 72, 0.07);
  min-width: 140px;
  box-shadow: none !important;
  padding: 5px 15px;
  font-size: 18px;
  height: 43px;
  border: 0;
  border-radius: 100px;
  -moz-border-radius: 100px;
  -webkit-border-radius: 100px;
}

.main-form .main-button:hover {
  background: var(--nimiq-light-blue);
}

.main-form .main-input {
    font-size: 1.8em;
}

.main-advanced {
    box-shadow: none;
    border-radius: 6px
}

textarea,
textarea.d-editor-input,
input {
    /* both classes to make sure it overwrites */
    color: var(--nimiq-blue) !important;
    border: 1px solid transparent !important;
    box-shadow: none !important;
    border-radius: 6px !important;

}

input::placeholder {
    color: var(--nimiq-light-blue70) !important;
}

input:hover {
    color: var(--nimiq-light-blue10);
    border-color: var(--nimiq-blue10) !important;
}

input:hover:not(:empty) {
    color: var(--nimiq-blue70);
    border-color: var(--nimiq-blue10) !important;
}

input:focus {
    color: var(--nimiq-light-blue70);
    border-color: var(--nimiq-light-blue20) !important;
}

input:focus:not(:empty) {
    color: var(--nimiq-light-blue100);
}

.input-group-addon {
    border: none;
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
  flex-direction: row;
}
.nimiq-address {
  flex: 1;
  margin-right: 20px;
}

@media screen and (max-width: 768px) {
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
-->
<style lang="scss" scoped>

</style>
