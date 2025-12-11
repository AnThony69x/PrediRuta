// Index file to load all translation modules
import commonEs from './locales/es/common.json';
import commonEn from './locales/en/common.json';
import authEs from './locales/es/auth.json';
import authEn from './locales/en/auth.json';
import headerEs from './locales/es/header.json';
import headerEn from './locales/en/header.json';
import accessibilityEs from './locales/es/accessibility.json';
import accessibilityEn from './locales/en/accessibility.json';
import landingEs from './locales/es/landing.json';
import landingEn from './locales/en/landing.json';
import dashboardEs from './locales/es/dashboard.json';
import dashboardEn from './locales/en/dashboard.json';

export const translations = {
  es: {
    common: commonEs,
    auth: authEs,
    header: headerEs,
    accessibility: accessibilityEs,
    landing: landingEs,
    dashboard: dashboardEs,
  },
  en: {
    common: commonEn,
    auth: authEn,
    header: headerEn,
    accessibility: accessibilityEn,
    landing: landingEn,
    dashboard: dashboardEn,
  },
};

export type Locale = 'es' | 'en';
