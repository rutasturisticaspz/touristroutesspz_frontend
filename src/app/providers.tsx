'use client';

import { useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { iniciarI18n, leerIdiomaGuardado } from '../i18n';
import { IdiomaProvider } from '../context/IdiomaContext';
import { PlanProvider } from '../context/PlanContext';

// Proveedores del sitio: traducciones, idioma y plan de lugares.
// i18next se inicializa siempre en español para que el HTML que arma
// el servidor coincida con el primer render del navegador. El idioma
// guardado se aplica enseguida, dentro de IdiomaProvider.
export default function Providers({ children }: { children: ReactNode }) {
  const [i18n] = useState(() => iniciarI18n(leerIdiomaGuardado()));

  return (
    <I18nextProvider i18n={i18n}>
      <IdiomaProvider>
        <PlanProvider>{children}</PlanProvider>
      </IdiomaProvider>
    </I18nextProvider>
  );
}
