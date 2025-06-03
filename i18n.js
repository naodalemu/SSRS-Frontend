import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import am from "./locales/am.json";
import om from "./locales/om.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        am: { translation: am },
        om: { translation: om },
    },
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
        escapeValue: false, // React already escapes values
    },
});

export default i18n;