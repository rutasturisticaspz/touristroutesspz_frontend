import type { ReactNode } from 'react';

// Card shared by the screens shown before signing in: login, "forgot my
// password" and choosing a new password.
export default function AccessCard({
  title,
  help,
  children,
}: {
  title: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div className="rt_login">
      <div className="rt_login_caja">
        <img src="/img/logoRT.png" alt="Rutas Turísticas" />
        <h1>{title}</h1>
        {help && <p className="ayuda">{help}</p>}
        {children}
      </div>
    </div>
  );
}
