# ------------------------------------------------------------
#  Public site — Rutas Turísticas Pérez Zeledón
#
#  NOTE on the NEXT_PUBLIC_* variables: Next embeds them in the
#  JavaScript sent to the browser DURING THE BUILD, not at startup.
#  That is why they go as ARG and not only as container environment
#  variables: if they are passed at startup, they do not reach the
#  browser.
#
#  And for the same reason, NEXT_PUBLIC_API_URL has to be the address
#  seen by the person's BROWSER, not the one on Docker's internal
#  network. Putting http://backend:2999 here builds a site nobody can
#  use: that name only exists inside the container network.
# ------------------------------------------------------------

# --- Stage 1: dependencies ---
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Stage 2: build ---
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

# --- Stage 3: runtime ---
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# The minimal server that `output: standalone` produces, plus the
# static files and images, which are not inside that bundle.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --chown=node:node --from=build /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]
