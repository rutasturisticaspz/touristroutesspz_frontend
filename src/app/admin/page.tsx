'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSesion } from '../../context/SesionContext';

// /admin — inicio de sesión del panel.
// Cambios respecto al signin anterior:
//  - No usa sweetalert2 para avisar del error; el mensaje sale debajo
//    del formulario, que es donde el usuario está mirando.
//  - El error que se muestra es el que manda el backend, que responde
//    lo mismo para "usuario que no existe" y "clave incorrecta". Antes
//    sólo se mostraba si el status era 500, así que un 401 —el caso
//    normal— no decía absolutamente nada.
//  - No hay botón de Google: dependía de Firebase Auth.

function saludo(): string {
  const hora = new Date().getHours();
  if (hora < 12) return 'Buenos días';
  if (hora < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function Pagina() {
  const router = useRouter();
  const { usuario, verificando, iniciarSesion } = useSesion();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  // El saludo depende de la hora, que en el servidor y en el navegador
  // pueden no coincidir. Se calcula después de montar.
  const [texto, setTexto] = useState('Bienvenido');

  useEffect(() => setTexto(saludo()), []);

  useEffect(() => {
    if (!verificando && usuario) router.replace('/admin/atracciones');
  }, [verificando, usuario, router]);

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (enviando) return;

    setEnviando(true);
    setError(null);
    try {
      await iniciarSesion(email.trim(), password);
      router.replace('/admin/atracciones');
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'No se pudo iniciar sesión');
      setEnviando(false);
    }
  };

  if (verificando) {
    return (
      <div className="rt_login">
        <p>…</p>
      </div>
    );
  }

  return (
    <div className="rt_login">
      <div className="rt_login_caja">
        <img src="/img/logoRT.png" alt="Rutas Turísticas" />
        <h1>{texto}, iniciá sesión</h1>
        <p className="ayuda">Panel de administración de Rutas Turísticas Pérez Zeledón.</p>

        <form onSubmit={enviar}>
          <div className="rt_admin_campo">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="rt_admin_campo">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="rt_aviso rt_aviso_error">{error}</div>}

          <button type="submit" className="rt_boton" style={{ width: '100%' }} disabled={enviando}>
            {enviando ? 'Entrando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
