import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locales/en';
import id from './locales/id';

// const locale =
//   Platform.OS === "ios"
//     ? NativeModules.SettingsManager.settings.AppleLocale
//     : NativeModules.I18nManager.localeIdentifier;

i18n.use(initReactI18next).init({
  // locale:locale,
  resources: {
    en: {translation: en},
    id: {translation: id},
  },
  lng: 'en', // if you're using a language detector, do not define the lng option
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});
// i18n.changeLanguage('id');

export default i18n;
