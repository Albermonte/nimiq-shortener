<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>


<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";
$size-1: 10rem;

body,
html {
  height: 100%;
}

#app {
  font-family: Muli;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: var(--nimiq-blue);*/
  background-image: var(--nimiq-blue-bg);
  height: 100%;
}

@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
