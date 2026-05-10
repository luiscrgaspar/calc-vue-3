import { shallowMount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import es from "@/locales/es-ES.json";
import en from "@/locales/en-US.json";
import pt from "@/locales/pt-PT.json";
import CalculatorLineContent from "@/components/CalculatorLineContent/CalculatorLineContent.vue";
import store from "@/store/index";

const i18n = createI18n({
  legacy: true,
  globalInjection: true,
  locale: "en-US",
  fallbackLocale: "en-US",
  messages: { es, en, pt },
  silentFallbackWarn: true,
});

function mountLine(props: any) {
  return shallowMount(CalculatorLineContent, {
    global: {
      plugins: [store, i18n],
    },
    props,
  });
}

describe("CalculatorLineContent", () => {
  test("renders a calculator row and emits the right handlers", async () => {
    const wrapper = mountLine({ icons: ["π", "CE", "C", "<"] });

    const buttons = wrapper.findAll("button");
    expect(buttons).toHaveLength(4);
    expect(buttons[0]?.text()).toBe("π");
    expect(buttons[1]?.text()).toBe("CE");
    expect(buttons[2]?.text()).toBe("C");
    expect(buttons[3]?.text()).toBe("<");

    await buttons[0]?.trigger("click");
    await buttons[1]?.trigger("click");
    await buttons[2]?.trigger("click");
    await buttons[3]?.trigger("click");

    expect(wrapper.emitted("handler1")).toBeTruthy();
    expect(wrapper.emitted("handler2")).toBeTruthy();
    expect(wrapper.emitted("handler3")).toBeTruthy();
    expect(wrapper.emitted("handler4")).toBeTruthy();
  });

  test("pads shorter metadata arrays and respects disabled buttons", () => {
    const wrapper = mountLine({
      icons: ["1", "2", "3", "+"],
      disabledButtons: [true],
      classButtons: ["calculator-content-line-equal-button"],
    });

    const buttons = wrapper.findAll("button");

    expect(buttons[0]?.classes()).toContain(
      "calculator-content-line-equal-button"
    );
    expect(buttons[0]?.attributes("disabled")).toBe("");
    expect(buttons[1]?.classes()).toContain(
      "calculator-content-line-normal-button"
    );
    expect(buttons[1]?.attributes("disabled")).toBeUndefined();
    expect(buttons[3]?.classes()).toContain(
      "calculator-content-line-normal-button"
    );
  });
});
