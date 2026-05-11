<template>
  <div class="calculator-languages">
    <a
      v-for="language in languages"
      :key="language.label"
      :class="`calculator-language calculator-language-${language.label} ${
        language.active ? 'calculator-language-active' : ''
      }`"
      href="#"
      @click.prevent="changeLanguage(language.key)"
      >{{ language.label }}</a
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "LanguagesContent",
  computed: {
    ...mapGetters(["languages", "currentValue", "error", "isInfinity"]),
  },
  methods: {
    ...mapActions(["setCurrentLanguage", "setCurrentValue"]),
    changeLanguage(language: string): void {
      this.setCurrentLanguage(language);
      this.$i18n.locale = language;
      if (this.isInfinity) {
        this.setCurrentValue(
          this.$t(this.currentValue.startsWith("-") ? "-infinity" : "infinity")
        );
      }
      if (this.error !== "") this.setCurrentValue(this.$t(`${this.error}`));
    },
  },
});
</script>

<style lang="scss" scoped>
.calculator-languages {
  display: flex;
  width: 315px;
  justify-content: end;
  gap: 8px;
}

.calculator-language {
  text-decoration: none;
  color: white;

  &-active {
    color: #325c7f;
  }

  &:hover {
    color: #bf6c86;
  }
}
</style>
