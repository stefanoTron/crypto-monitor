import i18n from "i18next";
import Backend from "i18next-xhr-backend";

/**
 * Initialize a i18next instance.
 * @function startI18n
 * @param {string} lang - Active language.
 */
const startI18n = lang =>
  i18n.use(Backend).init({
    lng: lang,
    fallbackLng: "en",
    ns: ["translations"],
    defaultNS: "translations",
    debug: false,
    backend: {
      loadPath: "/static/locales/{{lng}}/translations.json"
    }
  });

export default startI18n;
