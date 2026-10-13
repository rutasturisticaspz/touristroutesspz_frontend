'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import global_es from './es/global.json';
import global_en from './en/global.json';
import { IDIOMA_POR_DEFECTO } from '../lib/config';

// Translations. They are the same JSON files from the previous site,
// untouched, so that not a single label changes its text.
// The language is read from localStorage like before. The difference
// is that here it is done inside an effect and not when importing the
// module: in Next the code also runs on the server, where localStorage
// does not exist, and reading it directly crashed the page.

export const IDIOMAS = ['es', 'en'] as const;
export type Idioma = (typeof IDIOMAS)[number];

let iniciado = false;

export function iniciarI18n(idioma: Idioma = IDIOMA_POR_DEFECTO as Idioma) {
  if (iniciado) return i18next;
  iniciado = true;

  void i18next.use(initReactI18next).init({
    interpolation: { escapeValue: false },
    lng: idioma,
    fallbackLng: IDIOMA_POR_DEFECTO,
    defaultNS: 'global',
    resources: {
      es: { global: global_es },
      en: { global: global_en },
    },
  });

  return i18next;
}

export function leerIdiomaGuardado(): Idioma {
  if (typeof window === 'undefined') return IDIOMA_POR_DEFECTO as Idioma;
  const guardado = window.localStorage.getItem('language');
  return (IDIOMAS as readonly string[]).includes(guardado ?? '')
    ? (guardado as Idioma)
    : (IDIOMA_POR_DEFECTO as Idioma);
}

export default i18next;
