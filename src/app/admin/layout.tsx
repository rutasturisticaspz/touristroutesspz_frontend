'use client';

import type { ReactNode } from 'react';
import { SesionProvider } from '../../context/SesionContext';
import '../../styles/admin.css';

// Everything under /admin shares the session.
// The panel lives inside the same application as the public site
// —a single application, as agreed— but it is the only area that asks
// for credentials. The public site does not mount this provider and
// therefore never touches the token.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <SesionProvider>{children}</SesionProvider>;
}
