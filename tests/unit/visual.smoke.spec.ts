import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createStore } from "vuex";
import App from "@/App.vue";
import calculator from "@/store/modules/calculator";
import en from "@/locales/en-US.json";
import es from "@/locales/es-ES.json";
import pt from "@/locales/pt-PT.json";

const DIVIDE = String.fromCharCode(247);

function createVisualStore() {
  return createStore({
    modules: {
      calculator: {
        ...calculator,
        state: JSON.parse(JSON.stringify(calculator.state)),
      },
    },
  });
}

function createVisualI18n() {
  return createI18n({
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
}

function mountApp() {
  return mount(App, {
    global: {
      plugins: [createVisualStore(), createVisualI18n()],
    },
  });
}

async function clickButton(wrapper: ReturnType<typeof mountApp>, text: string) {
  const button = wrapper
    .findAll("button")
    .find((lineButton) => lineButton.text() === text);

  expect(button).toBeTruthy();
  if (!button) {
    throw new Error(`Button not found: ${text}`);
  }

  await button.trigger("click");
}

describe("visual smoke", () => {
  test("renders the default calculator shell", () => {
    const wrapper = mountApp();

    expect(wrapper.find(".calculator-content").exists()).toBe(true);
    expect(wrapper.find(".calculator-content-header-title").text()).toBe(
      "Calculator"
    );
    expect(wrapper.find(".calculator-content-header-result-text").text()).toBe(
      "0"
    );
  });

  test("shows the divide by zero error state", async () => {
    const wrapper = mountApp();

    await clickButton(wrapper, "1");
    await clickButton(wrapper, DIVIDE);
    await clickButton(wrapper, "0");
    await clickButton(wrapper, "=");

    expect(wrapper.find(".calculator-content-header-result-text-error").text()).toBe(
      "Cannot divide by zero"
    );
  });

  test("shows the reciprocal infinity state", async () => {
    const wrapper = mountApp();

    await clickButton(wrapper, "1/x");

    expect(wrapper.find(".calculator-content-header-result-text").text()).toBe(
      "Infinity"
    );
  });

  test("updates translated error copy when the locale changes", async () => {
    const wrapper = mountApp();

    await clickButton(wrapper, "1");
    await clickButton(wrapper, DIVIDE);
    await clickButton(wrapper, "0");
    await clickButton(wrapper, "=");
    await wrapper.find(".calculator-language-ES").trigger("click");

    expect(wrapper.find(".calculator-content-header-result-text-error").text()).toBe(
      "No se puede dividir por cero"
    );
    expect(wrapper.find(".calculator-content-header-title").text()).toBe(
      "Calculadora"
    );
  });

  test("updates translated error copy in Portuguese", async () => {
    const wrapper = mountApp();

    await clickButton(wrapper, "1");
    await clickButton(wrapper, DIVIDE);
    await clickButton(wrapper, "0");
    await clickButton(wrapper, "=");
    await wrapper.find(".calculator-language-PT").trigger("click");

    expect(wrapper.find(".calculator-content-header-result-text-error").text()).toBe(
      "Não é possível dividir por zero"
    );
    expect(wrapper.find(".calculator-content-header-title").text()).toBe(
      "Calculadora"
    );
  });

  test("shows addition with two numbers", async () => {
    const wrapper = mountApp();

    await clickButton(wrapper, "1");
    await clickButton(wrapper, "+");
    await clickButton(wrapper, "2");
    await clickButton(wrapper, "=");

    expect(wrapper.find(".calculator-content-header-result-text").text()).toBe(
      "3"
    );
  });

  test("shows subtraction with two numbers", async () => {
    const wrapper = mountApp();

    await clickButton(wrapper, "5");
    await clickButton(wrapper, "-");
    await clickButton(wrapper, "2");
    await clickButton(wrapper, "=");

    expect(wrapper.find(".calculator-content-header-result-text").text()).toBe(
      "3"
    );
  });

  test("shows multiplication with two numbers", async () => {
    const wrapper = mountApp();

    await clickButton(wrapper, "3");
    await clickButton(wrapper, "x");
    await clickButton(wrapper, "4");
    await clickButton(wrapper, "=");

    expect(wrapper.find(".calculator-content-header-result-text").text()).toBe(
      "12"
    );
  });

  test("shows division with two numbers", async () => {
    const wrapper = mountApp();

    await clickButton(wrapper, "8");
    await clickButton(wrapper, DIVIDE);
    await clickButton(wrapper, "2");
    await clickButton(wrapper, "=");

    expect(wrapper.find(".calculator-content-header-result-text").text()).toBe(
      "4"
    );
  });
});
