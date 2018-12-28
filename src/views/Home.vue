<template>
  <div class="home">
    <ShortForm/>
  </div>
</template>

<script>
// @ is an alias to /src
import ShortForm from "../components/ShortForm.vue";

export default {
  name: "home",
  components: {
    ShortForm
  }
};
</script>
