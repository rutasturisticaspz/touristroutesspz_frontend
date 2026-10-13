'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IDIOMAS, leerIdiomaGuardado, type Idioma } from '../i18n';

// Current language of the site.
// In the old project every component did
// `localStorage.getItem('language')` on its own —there are more than
// thirty places— and compared against the string 'es'. That meant
// that when the language was changed, components that were already
// mounted did not find out until a reload. Here the language is shared
// state and everything is repainted at once.

interface ValorIdioma {
  idioma: Idioma;
  cambiarIdioma: (idioma: Idioma) => void;
  esEspanol: boolean;
}

const IdiomaContext = createContext<ValorIdioma | null>(null);

export function useIdioma(): ValorIdioma {
  const contexto = useContext(IdiomaContext);
  if (!contexto) throw new Error('useIdioma debe usarse dentro de <IdiomaProvider>');
  return contexto;
}

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation('global');
  const [idioma, setIdioma] = useState<Idioma>('es');

  useEffect(() => {
    const guardado = leerIdiomaGuardado();
    setIdioma(guardado);
    void i18n.changeLanguage(guardado);
  }, [i18n]);

  const cambiarIdioma = useCallback(
    (nuevo: Idioma) => {
      if (!IDIOMAS.includes(nuevo)) return;
      setIdioma(nuevo);
      void i18n.changeLanguage(nuevo);
      try {
        window.localStorage.setItem('language', nuevo);
      } catch {
        // Without storage the change only lasts for this visit.
      }
    },
    [i18n],
  );

  return (
    <IdiomaContext.Provider value={{ idioma, cambiarIdioma, esEspanol: idioma === 'es' }}>
      {children}
    </IdiomaContext.Provider>
  );
}
