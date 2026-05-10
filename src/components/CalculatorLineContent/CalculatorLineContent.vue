<template>
  <div class="calculator-content-line">
    <button
      :class="finalClassButtons[index]"
      v-for="(icon, index) in icons"
      :key="`prop_${index}`"
      @click="$emit(`handler${index + 1}`, Number.isInteger(+icon) ? +icon : undefined)"
      :disabled="finalDisabledButtons[index]"
    >
      {{ icon }}
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { PropType } from "vue";

const DEFAULT_BUTTON_CLASS = "calculator-content-line-normal-button";

function normalizeList<T>(items: T[], length: number, fallback: T): T[] {
  return Array.from({ length }, (_, index) => items[index] ?? fallback);
}

export default defineComponent({
  name: "CalculatorLineContent",
  props: {
    icons: {
      type: Array as PropType<string[]>,
      required: true,
    },
    disabledButtons: {
      type: Array as PropType<boolean[]>,
      default: () => [false, false, false, false],
    },
    classButtons: {
      type: Array as PropType<string[]>,
      default: () => [
        "calculator-content-line-normal-button",
        "calculator-content-line-normal-button",
        "calculator-content-line-normal-button",
        "calculator-content-line-normal-button",
      ],
    },
  },
  computed: {
    finalDisabledButtons(): boolean[] {
      return normalizeList(this.disabledButtons, this.icons.length, false);
    },
    finalClassButtons(): string[] {
      return normalizeList(
        this.classButtons,
        this.icons.length,
        DEFAULT_BUTTON_CLASS
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.calculator-content-line {
  display: flex;
  width: 100%;
  height: 50px;
  gap: 4px;

  &-normal-button,
  &-equal-button {
    width: 70px;
    height: 45px;
    border-radius: 4px;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
    border: none;
  }

  &-normal-button {
    &:focus-visible {
      outline: 2px solid #bf6c86;
      outline-offset: 2px;
    }

    &:hover {
      background-color: #e5e5e5;
    }
  }

  &-normal-button:disabled {
    background-color: #a8a7a7;
    color: #150c24;
    cursor: not-allowed;
  }

  &-equal-button {
    background-color: black;
    color: white;
  }
}
</style>
