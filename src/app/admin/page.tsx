'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AccessCard from '../../components/Admin/AccessCard';
import { useSesion } from '../../context/SesionContext';

// /admin — panel sign-in.
// Changes from the previous signin:
//  - It does not use sweetalert2 to report the error; the message
//    appears below the form, which is where the user is looking.
//  - The error shown is the one the backend sends, which responds the
//    same for "user that does not exist" and "wrong password". Before,
//    it was only shown if the status was 500, so a 401 —the normal
//    case— said absolutely nothing.
//  - There is no Google button: it depended on Firebase Auth.

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
  // The greeting depends on the time, which on the server and in the
  // browser may not match. It is computed after mounting.
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
    <AccessCard
      title={`${texto}, iniciá sesión`}
      help="Panel de administración de Rutas Turísticas Pérez Zeledón."
    >
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

        <p className="rt_login_links">
          <Link href="/admin/forgot-password">¿Olvidaste tu contraseña?</Link>
        </p>

        {error && <div className="rt_aviso rt_aviso_error">{error}</div>}

        <button type="submit" className="rt_boton rt_button_block" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Ingresar'}
        </button>
      </form>
    </AccessCard>
  );
}
