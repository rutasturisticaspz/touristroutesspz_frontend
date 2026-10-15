'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import AccessCard from '../../../components/Admin/AccessCard';
import { apiAdmin } from '../../../lib/apiAdmin';

// /admin/reset-password?token=... — where the link from the email lands.
// It checks the link first, so the person finds out right away if it
// already expired instead of after typing a password.

const MIN_LENGTH = 8;
const MAX_LENGTH = 72;

type Status = 'checking' | 'valid' | 'invalid' | 'done';

function ChoosePassword() {
  const token = useSearchParams().get('token') ?? '';

  const [status, setStatus] = useState<Status>('checking');
  const [name, setName] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token === '') {
      setStatus('invalid');
      return;
    }

    let current = true;
    apiAdmin
      .validatePasswordLink(token)
      .then((data) => {
        if (!current) return;
        setName(data.nombre);
        setStatus('valid');
      })
      .catch(() => {
        if (current) setStatus('invalid');
      });

    return () => {
      current = false;
    };
  }, [token]);

  const validLength = password.length >= MIN_LENGTH && password.length <= MAX_LENGTH;
  const matches = password === confirmation;
  const canSave = validLength && matches && confirmation !== '' && !saving;

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSave) return;

    setSaving(true);
    setError(null);
    try {
      await apiAdmin.choosePassword(token, password);
      setStatus('done');
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'No se pudo cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'checking') {
    return (
      <AccessCard title="Verificando el enlace…">
        <p className="rt_text_muted">Un momento.</p>
      </AccessCard>
    );
  }

  if (status === 'invalid') {
    return (
      <AccessCard title="Este enlace ya no sirve">
        <div className="rt_aviso rt_aviso_error">
          El enlace no es válido o ya venció. Cada enlace dura un tiempo limitado y solo se puede
          usar una vez.
        </div>
        <Link href="/admin/forgot-password" className="rt_boton rt_button_block">
          Pedir un enlace nuevo
        </Link>
        <p className="rt_login_links">
          <Link href="/admin">Volver a iniciar sesión</Link>
        </p>
      </AccessCard>
    );
  }

  if (status === 'done') {
    return (
      <AccessCard title="Contraseña actualizada">
        <div className="rt_aviso rt_aviso_ok">Ya podés entrar con tu contraseña nueva.</div>
        <Link href="/admin" className="rt_boton rt_button_block">
          Iniciar sesión
        </Link>
      </AccessCard>
    );
  }

  const fieldType = visible ? 'text' : 'password';

  return (
    <AccessCard
      title="Elegí tu contraseña"
      help={name ? `Hola ${name}. Escribí la contraseña nueva de tu cuenta.` : undefined}
    >
      <form onSubmit={save}>
        <div className="rt_admin_campo">
          <label htmlFor="new-password">Contraseña nueva</label>
          <input
            id="new-password"
            type={fieldType}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p
            className={
              password !== '' && !validLength ? 'rt_note rt_note_error' : 'rt_note rt_note_last'
            }
          >
            Entre {MIN_LENGTH} y {MAX_LENGTH} caracteres.
          </p>
        </div>

        <div className="rt_admin_campo">
          <label htmlFor="password-confirmation">Repetí la contraseña</label>
          <input
            id="password-confirmation"
            type={fieldType}
            autoComplete="new-password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            required
          />
          {confirmation !== '' && !matches && (
            <p className="rt_note rt_note_error">Las contraseñas no coinciden.</p>
          )}
        </div>

        <label className="rt_check rt_check_spaced">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
          Mostrar las contraseñas
        </label>

        {error && <div className="rt_aviso rt_aviso_error">{error}</div>}

        <button type="submit" className="rt_boton rt_button_block" disabled={!canSave}>
          {saving ? 'Guardando…' : 'Guardar contraseña'}
        </button>
      </form>
    </AccessCard>
  );
}

// useSearchParams needs a Suspense boundary for the page to build.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ChoosePassword />
    </Suspense>
  );
}
