'use client';

import { useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { iniciarI18n, leerIdiomaGuardado } from '../i18n';
import { IdiomaProvider } from '../context/IdiomaContext';
import { PlanProvider } from '../context/PlanContext';
import { NovedadesProvider } from '../context/NovedadesContext';

// Site providers: translations, language, places plan and news.
// i18next is always initialized in Spanish so the HTML the server
// builds matches the browser's first render. The saved language is
// applied right away, inside IdiomaProvider.
export default function Providers({ children }: { children: ReactNode }) {
  const [i18n] = useState(() => iniciarI18n(leerIdiomaGuardado()));

  return (
    <I18nextProvider i18n={i18n}>
      <IdiomaProvider>
        <PlanProvider>
          <NovedadesProvider>{children}</NovedadesProvider>
        </PlanProvider>
      </IdiomaProvider>
    </I18nextProvider>
  );
}
