<template>
  <Home />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Home from './components/Home.vue';

export default defineComponent({
  name: 'App',
  components: {
    Home,
  },
});
</script>

<style lang="scss">
@import 'public/styles/weather';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  input, button {
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
