<template>
  <div class="home">
    <ShortForm/>
  </div>
</template>

<script>
// @ is an alias to /src
import ShortForm from "@/components/ShortForm.vue";
import Firebase from "firebase";

// Don't worry, this api is only for development

let database = Firebase.initializeApp({
    apiKey: "AIzaSyBHiRa-voXiKVidaGSCIbmh0zf30Z5tBEI",
    authDomain: "shortnim-ce07f.firebaseapp.com",
    databaseURL: "https://shortnim-ce07f.firebaseio.com",
    projectId: "shortnim-ce07f",
    storageBucket: "shortnim-ce07f.appspot.com",
    messagingSenderId: "858691302448"
}).database().ref();

export default {
  name: "home",
  components: {
    ShortForm
  }
};
</script>
