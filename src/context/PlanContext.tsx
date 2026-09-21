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

// El "plan de lugares": la lista que el visitante va armando mientras
// navega. Vive sólo en el navegador, no toca la base de datos.
// Igual que antes, pero con dos arreglos:
//  - El original leía localStorage en el inicializador del useState.
//    En Next eso corre también en el servidor, donde localStorage no
//    existe. Aquí se lee en un efecto, después de montar.
//  - Por lo mismo, no se escribe el localStorage en el primer render,
//    que era lo que borraba el plan guardado apenas cargaba la página.

export interface ItemPlan {
  id: number;
  nombre: string;
  // Segmento del tipo, para poder volver a la ficha del sitio.
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

// Lo que se guarda de un sitio al agregarlo al itinerario.
// Se guarda una copia recortada, no el objeto entero: el itinerario
// vive en localStorage, que tiene unos pocos megabytes, y el sitio
// completo trae campos que la pantalla del plan no usa.
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
  // false hasta que se leyó localStorage, para no parpadear el contador.
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

export function PlanProvider({ children }: { children: ReactNode }) {
  const [planItems, setPlanItems] = useState<ItemPlan[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE);
      if (guardado) setPlanItems(JSON.parse(guardado) as ItemPlan[]);
    } catch {
      // Modo privado o almacenamiento bloqueado: se arranca vacío.
    }
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(planItems));
    } catch {
      // Sin almacenamiento el plan igual funciona, sólo no sobrevive al refresco.
    }
  }, [planItems, listo]);

  const addToPlan = useCallback((sitio: ItemPlan) => {
    setPlanItems((prev) => (prev.some((i) => i.id === sitio.id) ? prev : [...prev, sitio]));
  }, []);

  const removeFromPlan = useCallback((sitioId: number) => {
    setPlanItems((prev) => prev.filter((i) => i.id !== sitioId));
  }, []);

  const clearPlan = useCallback(() => setPlanItems([]), []);

  const valor = useMemo(
    () => ({ planItems, addToPlan, removeFromPlan, clearPlan, listo }),
    [planItems, addToPlan, removeFromPlan, clearPlan, listo],
  );

  return <PlanContext.Provider value={valor}>{children}</PlanContext.Provider>;
}
