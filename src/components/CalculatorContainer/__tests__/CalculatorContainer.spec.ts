import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createStore } from "vuex";
import es from "@/locales/es-ES.json";
import en from "@/locales/en-US.json";
import pt from "@/locales/pt-PT.json";
import CalculatorContainer from "@/components/CalculatorContainer/CalculatorContainer.vue";
import calculator from "@/store/modules/calculator";

function mountCalculator() {
  const i18n = createI18n({
    legacy: true,
    globalInjection: true,
    locale: "en-US",
    fallbackLocale: "en-US",
    messages: {
      "en-US": en,
      "es-ES": es,
      "pt-PT": pt,
    },
    silentFallbackWarn: true,
  });

  const store = createStore({
    modules: { calculator },
  });

  return mount(CalculatorContainer, {
    global: {
      plugins: [store, i18n],
    },
  });
}

function clickButton(wrapper: ReturnType<typeof mountCalculator>, text: string) {
  const button = wrapper
    .findAll(".calculator-content-line-normal-button")
    .find((lineButton) => lineButton.text() === text);

  expect(button).toBeTruthy();
  if (!button) {
    throw new Error(`Button not found: ${text}`);
  }

  return button.trigger("click");
}

describe("CalculatorContainer", () => {
  test("renders the calculator shell and switches languages", async () => {
    const wrapper = mountCalculator();

    expect(wrapper.find(".calculator-content").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "HeaderContent" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "LanguagesContent" }).exists()).toBe(
      true
    );

    await wrapper.find(".calculator-language-ES").trigger("click");
    expect(wrapper.find(".calculator-content-header-title").text()).toBe(
      "Calculadora"
    );

    await wrapper.find(".calculator-language-PT").trigger("click");
    expect(wrapper.find(".calculator-content-header-title").text()).toBe(
      "Calculadora"
    );

    await wrapper.find(".calculator-language-EN").trigger("click");
    expect(wrapper.find(".calculator-content-header-title").text()).toBe(
      "Calculator"
    );

    wrapper.unmount();
  });

  test("adds numbers and performs basic arithmetic", async () => {
    const wrapper = mountCalculator();

    await clickButton(wrapper, "3");
    await clickButton(wrapper, "+");
    await clickButton(wrapper, "5");
    await wrapper.find(".calculator-content-line-equal-button").trigger("click");

    expect(wrapper.find(".calculator-content-header-result-text").text()).toBe(
      "8"
    );

    wrapper.unmount();
  });

  test("shows divide by zero in each language", async () => {
    const wrapper = mountCalculator();

    await clickButton(wrapper, "3");
    await clickButton(wrapper, "÷");
    await clickButton(wrapper, "0");
    await wrapper.find(".calculator-content-line-equal-button").trigger("click");

    expect(wrapper.find(".calculator-content-header-result-text").text()).toBe(
      "Cannot divide by zero"
    );

    await wrapper.find(".calculator-language-ES").trigger("click");
    expect(wrapper.find(".calculator-content-header-result-text").text()).toBe(
      "No se puede dividir por cero"
    );

    await wrapper.find(".calculator-language-PT").trigger("click");
    expect(wrapper.find(".calculator-content-header-result-text").text()).toBe(
      "Não é possível dividir por zero"
    );

    wrapper.unmount();
  });

  test("handles memory buttons", async () => {
    const wrapper = mountCalculator();

    await clickButton(wrapper, "5");
    await clickButton(wrapper, "MS");
    await clickButton(wrapper, "C");
    await clickButton(wrapper, "MR");

    expect(wrapper.find(".calculator-content-header-result-text").text()).toBe(
      "5"
    );

    await clickButton(wrapper, "MC");

    const buttons = wrapper.findAll(".calculator-content-line-normal-button");
    const memoryCleanButton = buttons.find((button) => button.text() === "MC");
    const memoryRecoverButton = buttons.find((button) => button.text() === "MR");

    expect(memoryCleanButton?.attributes("disabled")).toBe("");
    expect(memoryRecoverButton?.attributes("disabled")).toBe("");

    wrapper.unmount();
  });
});
