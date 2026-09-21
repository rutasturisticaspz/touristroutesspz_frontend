'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IDIOMAS, leerIdiomaGuardado, type Idioma } from '../i18n';

// Idioma actual del sitio.
// En el proyecto viejo cada componente hacía
// `localStorage.getItem('language')` por su cuenta —hay más de treinta
// lugares— y comparaba contra la cadena 'es'. Eso significaba que al
// cambiar de idioma, los componentes que ya estaban montados no se
// enteraban hasta recargar. Aquí el idioma es estado compartido y todo
// se vuelve a pintar de una vez.

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
        // Sin almacenamiento el cambio vale para esta visita nada más.
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
