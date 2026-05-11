import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import es from "@/locales/es-ES.json";
import en from "@/locales/en-US.json";
import pt from "@/locales/pt-PT.json";
import HeaderContent from "@/components/HeaderContent/HeaderContent.vue";

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

describe("HeaderContent", () => {
  test("shows the content successfully with current value, no result and no error", () => {
    const wrapper = mount(HeaderContent, {
      global: {
        plugins: [i18n],
      },
      props: { currentValue: "0", currentResult: "", error: "" },
    });

    expect(wrapper.classes("calculator-content-header")).toBe(true);

    const calculatorHeaderTitle = wrapper.find(
      ".calculator-content-header-title"
    );
    expect(calculatorHeaderTitle.exists()).toBe(true);
    expect(calculatorHeaderTitle.text()).toBe(wrapper.vm.$t("calculator"));

    const calculatorHeaderResult = wrapper.find(
      ".calculator-content-header-result"
    );
    expect(calculatorHeaderResult.exists()).toBe(true);

    const calculatorHeaderResultText = wrapper.find(
      ".calculator-content-header-result-text"
    );
    expect(calculatorHeaderResultText.exists()).toBe(true);
    expect(calculatorHeaderResultText.text()).toBe("0");
    expect(calculatorHeaderResultText.attributes("role")).toBe("status");
    expect(calculatorHeaderResultText.attributes("aria-live")).toBe("polite");
    expect(calculatorHeaderResultText.attributes("aria-atomic")).toBe("true");

    const calculatorHeaderResultTextError = wrapper.find(
      ".calculator-content-header-result-text-error"
    );
    expect(calculatorHeaderResultTextError.exists()).toBe(false);
  });

  test("shows the content successfully with current value, current result and no error", () => {
    const wrapper = mount(HeaderContent, {
      global: {
        plugins: [i18n],
      },
      props: { currentValue: "10", currentResult: "100", error: "" },
    });

    expect(wrapper.classes("calculator-content-header")).toBe(true);

    const calculatorHeaderTitle = wrapper.find(
      ".calculator-content-header-title"
    );
    expect(calculatorHeaderTitle.exists()).toBe(true);
    expect(calculatorHeaderTitle.text()).toBe(wrapper.vm.$t("calculator"));

    const calculatorHeaderResult = wrapper.find(
      ".calculator-content-header-result"
    );
    expect(calculatorHeaderResult.exists()).toBe(true);

    const calculatorHeaderResultText = wrapper.find(
      ".calculator-content-header-result-text"
    );
    expect(calculatorHeaderResultText.exists()).toBe(true);
    expect(calculatorHeaderResultText.text()).toBe("100");
    expect(calculatorHeaderResultText.attributes("aria-live")).toBe("polite");

    const calculatorHeaderResultTextError = wrapper.find(
      ".calculator-content-header-result-text-error"
    );
    expect(calculatorHeaderResultTextError.exists()).toBe(false);
  });

  test("shows the content successfully with current value that has error", () => {
    const wrapper = mount(HeaderContent, {
      global: {
        plugins: [i18n],
      },
      props: {
        currentValue: "Cannot divide by zero",
        currentResult: "",
        error: "Cannot divide by zero",
      },
    });

    expect(wrapper.classes("calculator-content-header")).toBe(true);

    const calculatorHeaderTitle = wrapper.find(
      ".calculator-content-header-title"
    );
    expect(calculatorHeaderTitle.exists()).toBe(true);
    expect(calculatorHeaderTitle.text()).toBe(wrapper.vm.$t("calculator"));

    const calculatorHeaderResult = wrapper.find(
      ".calculator-content-header-result"
    );
    expect(calculatorHeaderResult.exists()).toBe(true);

    const calculatorHeaderResultText = wrapper.find(
      ".calculator-content-header-result-text"
    );
    expect(calculatorHeaderResultText.exists()).toBe(true);

    const calculatorHeaderResultTextError = wrapper.find(
      ".calculator-content-header-result-text-error"
    );
    expect(calculatorHeaderResultTextError.exists()).toBe(true);
    expect(calculatorHeaderResultTextError.text()).toBe(
      "Cannot divide by zero"
    );
    expect(calculatorHeaderResultTextError.attributes("aria-live")).toBe(
      "assertive"
    );
  });
});
