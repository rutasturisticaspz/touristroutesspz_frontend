'use client';

import Link from 'next/link';
import { useState } from 'react';
import AccessCard from '../../../components/Admin/AccessCard';
import { apiAdmin } from '../../../lib/apiAdmin';

// /admin/forgot-password — asks for a link to choose a new password.
// The confirmation is the same whether or not the email is registered
// (the backend answers the same), so this screen cannot be used to find
// out who has an account.

export default function Page() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;

    setSending(true);
    setError(null);
    try {
      const address = email.trim();
      await apiAdmin.requestPasswordLink(address);
      setSentTo(address);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'No se pudo enviar la solicitud');
    } finally {
      setSending(false);
    }
  };

  if (sentTo !== null) {
    return (
      <AccessCard title="Revisá tu correo">
        <div className="rt_aviso rt_aviso_ok">
          Si <strong>{sentTo}</strong> está registrado, te va a llegar un enlace para cambiar la
          contraseña. Vence en 1 hora y solo se puede usar una vez.
        </div>
        <p className="rt_note">
          Si no lo ves, revisá la carpeta de spam o pedí otro enlace en unos minutos.
        </p>
        <p className="rt_login_links">
          <Link href="/admin">Volver a iniciar sesión</Link>
        </p>
      </AccessCard>
    );
  }

  return (
    <AccessCard
      title="¿Olvidaste tu contraseña?"
      help="Escribí tu correo y te enviamos un enlace para elegir una contraseña nueva."
    >
      <form onSubmit={submit}>
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

        {error && <div className="rt_aviso rt_aviso_error">{error}</div>}

        <button type="submit" className="rt_boton rt_button_block" disabled={sending}>
          {sending ? 'Enviando…' : 'Enviar enlace'}
        </button>

        <p className="rt_login_links">
          <Link href="/admin">Volver a iniciar sesión</Link>
        </p>
      </form>
    </AccessCard>
  );
}
