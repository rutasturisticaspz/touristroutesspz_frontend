# ------------------------------------------------------------
#  Sitio público — Rutas Turísticas Pérez Zeledón
#
#  OJO con las variables NEXT_PUBLIC_*: Next las incrusta en el
#  JavaScript que se manda al navegador DURANTE LA COMPILACIÓN, no al
#  arrancar. Por eso van como ARG y no sólo como variables de entorno
#  del contenedor: si se pasan al arrancar, no llegan al navegador.
#
#  Y por lo mismo, NEXT_PUBLIC_API_URL tiene que ser la dirección que
#  ve el NAVEGADOR de la persona, no la de la red interna de Docker.
#  Poner http://backend:2999 aquí compila un sitio que nadie puede
#  usar: ese nombre sólo existe dentro de la red de contenedores.
# ------------------------------------------------------------

# --- Etapa 1: dependencias ---
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Etapa 2: compilación ---
FROM node:22-bookworm-slim AS build
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY=""
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_KEY
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Etapa 3: ejecución ---
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# El servidor mínimo que arma `output: standalone`, más los estáticos
# y las imágenes, que no van adentro de ese paquete.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --chown=node:node --from=build /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]
