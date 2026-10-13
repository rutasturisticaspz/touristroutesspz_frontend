'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import Toast from '../components/Toast';

// The "places plan": the list the visitor builds while browsing. It
// lives only in the browser and does not touch the database.
// Same as before, but with two fixes:
//  - The original read localStorage in the useState initializer. In
//    Next that also runs on the server, where localStorage does not
//    exist. Here it is read in an effect, after mounting.
//  - For the same reason, localStorage is not written on the first
//    render, which was what wiped the saved plan as soon as the page
//    loaded.

export interface ItemPlan {
  id: number;
  nombre: string;
  // Type segment, to be able to go back to the site's detail page.
  tipo: string;
  imagen?: string | null;
  descripcion?: string;
  descripcionIngles?: string;
  ubicacion?: {
    provincia: string | null;
    canton: string | null;
    distrito: string | null;
    latitud: string | null;
    longitud: string | null;
  } | null;
  contactos?: Array<{ id: number; tipo: string; valor: string }>;
  imagenes?: Array<{ id: number; url: string; nombre: string }>;
}

// What is saved of a site when it is added to the itinerary.
// A trimmed copy is saved, not the whole object: the itinerary lives
// in localStorage, which has only a few megabytes, and the full site
// carries fields the plan screen does not use.
export function itemDePlan(
  sitio: {
    id: number;
    nombre: string;
    descripcion?: string;
    descripcionIngles?: string;
    ubicacion?: unknown;
    contactos?: unknown;
    imagenes?: unknown;
  },
  tipo: string,
  imagen?: string | null,
): ItemPlan {
  const ubicacion = sitio.ubicacion as ItemPlan['ubicacion'];
  return {
    id: sitio.id,
    nombre: sitio.nombre,
    tipo,
    imagen,
    descripcion: sitio.descripcion,
    descripcionIngles: sitio.descripcionIngles,
    ubicacion: ubicacion
      ? {
          provincia: ubicacion.provincia,
          canton: ubicacion.canton,
          distrito: ubicacion.distrito,
          latitud: ubicacion.latitud ?? null,
          longitud: ubicacion.longitud ?? null,
        }
      : null,
    contactos: (sitio.contactos as ItemPlan['contactos']) ?? [],
    imagenes: ((sitio.imagenes as Array<{ id: number; url: string; nombre: string }>) ?? []).map(
      (i) => ({ id: i.id, url: i.url, nombre: i.nombre }),
    ),
  };
}

interface ValorPlan {
  planItems: ItemPlan[];
  addToPlan: (sitio: ItemPlan) => void;
  removeFromPlan: (sitioId: number) => void;
  clearPlan: () => void;
  // false until localStorage has been read, so the counter does not
  // flicker.
  listo: boolean;
}

const PlanContext = createContext<ValorPlan | null>(null);

const CLAVE = 'planItems';

export function usePlan(): ValorPlan {
  const contexto = useContext(PlanContext);
  if (!contexto) {
    throw new Error('usePlan debe usarse dentro de <PlanProvider>');
  }
  return contexto;
}

const MS_AVISO = 3000;

type ClaveAviso = 'global.added_to_plan' | 'global.removed_from_plan';

export function PlanProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation('global');
  const [planItems, setPlanItems] = useState<ItemPlan[]>([]);
  const [listo, setListo] = useState(false);
  // Notice shown after changing the plan. `numero` is the Toast key, so
  // a second change while it is showing restarts its timer.
  const [aviso, setAviso] = useState<{ numero: number; clave: ClaveAviso } | null>(null);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE);
      if (guardado) setPlanItems(JSON.parse(guardado) as ItemPlan[]);
    } catch {
      // Private mode or blocked storage: it starts empty.
    }
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(planItems));
    } catch {
      // Without storage the plan still works, it just does not survive a
      // refresh.
    }
  }, [planItems, listo]);

  const mostrarAviso = useCallback((clave: ClaveAviso) => {
    setAviso((previo) => ({ numero: (previo?.numero ?? 0) + 1, clave }));
  }, []);

  // The notice only shows when the place was actually added: one that was
  // already in the plan is ignored, as before.
  const addToPlan = useCallback(
    (sitio: ItemPlan) => {
      if (planItems.some((i) => i.id === sitio.id)) return;
      setPlanItems([...planItems, sitio]);
      mostrarAviso('global.added_to_plan');
    },
    [planItems, mostrarAviso],
  );

  const cerrarAviso = useCallback(() => setAviso(null), []);

  // Only announced when something was really removed.
  const removeFromPlan = useCallback(
    (sitioId: number) => {
      if (!planItems.some((i) => i.id === sitioId)) return;
      setPlanItems(planItems.filter((i) => i.id !== sitioId));
      mostrarAviso('global.removed_from_plan');
    },
    [planItems, mostrarAviso],
  );

  const clearPlan = useCallback(() => setPlanItems([]), []);

  const valor = useMemo(
    () => ({ planItems, addToPlan, removeFromPlan, clearPlan, listo }),
    [planItems, addToPlan, removeFromPlan, clearPlan, listo],
  );

  return (
    <PlanContext.Provider value={valor}>
      {children}
      {aviso !== null && (
        <Toast key={aviso.numero} tipo="ok" alCerrar={cerrarAviso} duracionMs={MS_AVISO}>
          {t(aviso.clave)}
        </Toast>
      )}
    </PlanContext.Provider>
  );
}
