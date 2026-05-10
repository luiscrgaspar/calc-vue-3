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
  messages: {
    "en-US": en,
    "es-ES": es,
    "pt-PT": pt,
  },
  silentFallbackWarn: true,
});

function mountLine(props: {
  icons: string[];
  disabledButtons?: boolean[];
  classButtons?: string[];
}) {
  return shallowMount(CalculatorLineContent, {
    global: {
      plugins: [store, i18n],
    },
    props,
  });
}

describe("CalculatorLineContent", () => {
  test("renders a calculator row and emits undefined payloads for non-numeric icons", async () => {
    const wrapper = mountLine({ icons: ["PI", "CE", "C", "<"] });

    const buttons = wrapper.findAll("button");
    expect(buttons).toHaveLength(4);
    expect(buttons[0]?.text()).toBe("PI");
    expect(buttons[1]?.text()).toBe("CE");
    expect(buttons[2]?.text()).toBe("C");
    expect(buttons[3]?.text()).toBe("<");

    await buttons[0]?.trigger("click");
    await buttons[1]?.trigger("click");
    await buttons[2]?.trigger("click");
    await buttons[3]?.trigger("click");

    expect(wrapper.emitted("handler1")?.[0]).toEqual([undefined]);
    expect(wrapper.emitted("handler2")?.[0]).toEqual([undefined]);
    expect(wrapper.emitted("handler3")?.[0]).toEqual([undefined]);
    expect(wrapper.emitted("handler4")?.[0]).toEqual([undefined]);
  });

  test("emits numeric payloads for numeric icons", async () => {
    const wrapper = mountLine({ icons: ["1", "2", "3", "4"] });

    const buttons = wrapper.findAll("button");
    await buttons[0]?.trigger("click");
    await buttons[1]?.trigger("click");
    await buttons[2]?.trigger("click");
    await buttons[3]?.trigger("click");

    expect(wrapper.emitted("handler1")?.[0]?.[0]).toBe(1);
    expect(wrapper.emitted("handler2")?.[0]?.[0]).toBe(2);
    expect(wrapper.emitted("handler3")?.[0]?.[0]).toBe(3);
    expect(wrapper.emitted("handler4")?.[0]?.[0]).toBe(4);
    expect(typeof wrapper.emitted("handler1")?.[0]?.[0]).toBe("number");
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
