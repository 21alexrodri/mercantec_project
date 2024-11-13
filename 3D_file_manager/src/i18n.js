import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'dk'],
    nonExplicitSupportedLngs: true,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'cookie', 'querystring', 'htmlTag'], // Prioriza localStorage
      caches: ['localStorage', 'cookie'], // Guarda el idioma en localStorage y cookies
      lookupLocalStorage: 'i18nextLng',   // Nombre de la clave en localStorage
      lookupCookie: 'i18nextLng',
      checkWhitelist: true,
    },
    backend: {
      loadPath: '/langs/{{lng}}/{{ns}}.json',
    },
  });

// Detecta cambios en el idioma y guarda en localStorage
i18n.on('languageChanged', (lng) => {
  if (['en', 'dk'].includes(lng)) {
    localStorage.setItem('i18nextLng', lng); // Guarda el idioma seleccionado en localStorage
  } else {
    i18n.changeLanguage('en');  // Cambia al predeterminado si el idioma no es compatible
  }
});

export default i18n;
