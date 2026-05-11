
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import es from "./locales/es-ES.json";
import en from "./locales/en-US.json";
import pt from "./locales/pt-PT.json";
import store from "./store";

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

createApp(App).use(store).use(i18n).mount("#app");
