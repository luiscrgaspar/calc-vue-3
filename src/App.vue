<template>
  <div class="app">
    <CalculatorContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CalculatorContainer from './components/CalculatorContainer/CalculatorContainer.vue';

export default defineComponent({
  name: "App",
  components: {
    CalculatorContainer,
  },
});
</script>
