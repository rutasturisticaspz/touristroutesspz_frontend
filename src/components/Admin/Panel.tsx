'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useSesion } from '../../context/SesionContext';
import { MENU } from '../../lib/tiposAdmin';

// Panel frame: side menu and session guard.
// In the previous admin each page checked the session on its own
// —when it remembered—, so several painted themselves entirely before
// realizing there was no user. Here the check is in a single place
// and nothing in the panel is drawn without a session.
// Note: this is a convenience for the user, not security. What truly
// prevents touching the data is that the backend requires the token on
// every write.
export default function Panel({
  titulo,
  acciones,
  children,
  soloAdmin = false,
}: {
  titulo: string;
  // Buttons that go to the right of the title.
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
              // Section not built yet: it is shown greyed out instead of linking to
              // a page that would give a 404.
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
