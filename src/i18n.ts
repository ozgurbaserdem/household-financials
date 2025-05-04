import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import sv from './locales/sv.json'

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: en },
			sv: { translation: sv }
		},
		fallbackLng: 'sv',
		debug: false,
		interpolation: {
			escapeValue: false
		}
	})

export default i18n 