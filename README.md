# Sitio público — Rutas Turísticas Pérez Zeledón

Reemplazo del proyecto `Rutas-Turisticas-Cliente` (create-react-app 3,
React 16), con la misma apariencia y el mismo contenido, sobre Next 16
y TypeScript.

## Cómo levantarlo

```bash
npm install
npm run dev                  
```

El navegador le pide `/api` y `/uploads` al mismo sitio y Next los reenvía
al backend (ver `rewrites` en `next.config.ts`). En Docker eso va por la red
interna, a `http://backend:2999`. Fuera de Docker, con el backend corriendo
en su máquina, ponga en `.env.local`:

```
NEXT_PUBLIC_API_URL=/api
BACKEND_INTERNAL_URL=http://localhost:2999
```

## Qué se mantiene igual

- Los estilos: `src/styles/` son los mismos archivos que traía el
  proyecto anterior (Bootstrap 4, animate.css, themify, elagent…).
- Las imágenes: `public/img/` son las mismas, servidas tal cual.
- Las traducciones: `src/i18n/es` y `src/i18n/en`, sin tocar.
- Las rutas: `/inicio`, `/atracciones`, `/sitio/:tipo/:id`, etc.

## Qué cambió, y por qué

| Antes | Ahora | Motivo |
|---|---|---|
| `API_URL` con respaldo a `api.quehacerenperez.com` | sin respaldo, falla si falta la variable | Cualquier copia del código hablaba con producción sin avisar |
| jQuery + popper para el menú | estado de React | Eran dos dependencias sólo para abrir un desplegable |
| `react-stickynode` | `components/Sticky.tsx` | Sin versión compatible con React 19 |
| `react-reveal` | `components/Reveal.tsx` | Sin mantenimiento desde hace años |
| `localStorage.getItem('language')` en cada componente | `IdiomaContext` | Al cambiar idioma, lo ya montado no se enteraba hasta recargar |
| URLs de Firebase en la base | rutas `/uploads/...` del backend | Se soltó el almacenamiento de Firebase |


