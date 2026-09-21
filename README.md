# Sitio público — Rutas Turísticas Pérez Zeledón

Reemplazo del proyecto `Rutas-Turisticas-Cliente` (create-react-app 3,
React 16), con la misma apariencia y el mismo contenido, sobre Next 16
y TypeScript.

## Cómo levantarlo

```bash
npm install
npm run dev                  
```

El backend tiene que estar corriendo en http://localhost:2999.

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


