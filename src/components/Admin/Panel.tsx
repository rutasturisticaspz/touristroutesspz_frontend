'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useSesion } from '../../context/SesionContext';
import { MENU } from '../../lib/tiposAdmin';

// Marco del panel: menú lateral y guardia de sesión.
// En el admin anterior cada página comprobaba la sesión por su cuenta
// —cuando se acordaba—, así que varias se pintaban enteras antes de
// darse cuenta de que no había usuario. Acá la comprobación está en un
// solo lugar y nada del panel se dibuja sin sesión.
// Ojo: esto es comodidad para el usuario, no seguridad. Lo que impide
// de verdad tocar los datos es que el backend exige el token en cada
// escritura.
export default function Panel({
  titulo,
  acciones,
  children,
  soloAdmin = false,
}: {
  titulo: string;
  // Botones que van a la derecha del título.
  acciones?: ReactNode;
  children: ReactNode;
  soloAdmin?: boolean;
}) {
  const { usuario, verificando, esAdmin, cerrarSesion } = useSesion();
  const router = useRouter();
  const ruta = usePathname();

  useEffect(() => {
    if (!verificando && !usuario) router.replace('/admin');
  }, [verificando, usuario, router]);

  if (verificando) {
    return (
      <div className="rt_admin">
        <div className="rt_admin_contenido">
          <p>…</p>
        </div>
      </div>
    );
  }

  if (!usuario) return null;

  const entradas = MENU.filter((entrada) => !entrada.soloAdmin || esAdmin);

  return (
    <div className="rt_admin">
      <aside className="rt_admin_menu">
        <div className="rt_admin_marca">
          <strong>Rutas Turísticas</strong>
          <span>Administración</span>
        </div>

        <nav>
          {entradas.map((entrada) =>
            entrada.pendiente ? (
              // Sección todavía no construida: se muestra apagada en vez
              // de enlazar a una página que daría 404.
              <span key={entrada.ruta} className="pendiente" title="Todavía no está lista">
                {entrada.rotulo}
              </span>
            ) : (
              <Link
                key={entrada.ruta}
                href={entrada.ruta}
                className={ruta?.startsWith(entrada.ruta) ? 'activo' : ''}
              >
                {entrada.rotulo}
              </Link>
            ),
          )}
        </nav>

        <div className="rt_admin_pie">
          <p>
            {usuario.nombre || usuario.email}
            <br />
            {esAdmin ? 'Administrador' : 'Moderador'}
          </p>
          <button
            type="button"
            className="rt_boton rt_boton_secundario rt_boton_chico"
            onClick={() => {
              cerrarSesion();
              router.replace('/admin');
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="rt_admin_contenido">
        <div className="rt_admin_titulo">
          <h1>{titulo}</h1>
          {acciones}
        </div>

        {soloAdmin && !esAdmin ? (
          <div className="rt_aviso rt_aviso_error">
            Esta sección es sólo para administradores.
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
