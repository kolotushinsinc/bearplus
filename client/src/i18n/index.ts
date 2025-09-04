import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import ruTranslations from './locales/ru.json';
import enTranslations from './locales/en.json';
import cnTranslations from './locales/cn.json';

const resources = {
  ru: {
    translation: ruTranslations
  },
  en: {
    translation: enTranslations
  },
  cn: {
    translation: cnTranslations
  }
};

// Language detection function
const detectLanguage = (): string => {
  // Check localStorage first
  const savedLanguage = localStorage.getItem('i18nextLng');
  if (savedLanguage && ['ru', 'en', 'cn'].includes(savedLanguage)) {
    return savedLanguage;
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (['ru', 'en', 'cn'].includes(browserLang)) {
    return browserLang;
  }
  
  // Default fallback
  return 'ru';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
    fallbackLng: 'ru',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;