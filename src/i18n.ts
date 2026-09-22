import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import ja from "./locales/ja.json";
import runtimeEnv from "@/runtimeEnv";

const i18n = createI18n({
  legacy: false,
  locale: runtimeEnv.VITE_I18N_LOCALE || "en",
  fallbackLocale: runtimeEnv.VITE_I18N_FALLBACK_LOCALE || "en",
  messages: { en, ja },
});

export default i18n;
