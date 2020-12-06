<template>
  <div class="loader">
      <lottie-animation
        path="lotties/loader.json"
        :loop="true"
        :autoPlay="true"
        :speed="2"
      />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";

export default defineComponent({
    name: 'Loader',
    components: {
        LottieAnimation,
    }
});
</script>

<style scoped lang='scss'>
.loader {
    width: 200px;
    margin: auto;
}
</style>