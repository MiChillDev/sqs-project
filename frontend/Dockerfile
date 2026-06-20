# Stage 1: Shared dependencies
FROM node:22-alpine AS deps
WORKDIR /tmp/app
ENV HOME=/tmp/node-home \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN mkdir -p "$HOME" /tmp/app && chown -R node:node /tmp/app "$HOME"
USER node
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN corepack pnpm install --frozen-lockfile

# Stage 2: Development mode - Vite dev server with hot reload
FROM node:22-alpine AS dev
WORKDIR /app
ENV HOME=/tmp/node-home \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN mkdir -p "$HOME" /tmp/.vite
COPY --from=deps /tmp/app/node_modules ./node_modules
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
COPY frontend/index.html frontend/vite.config.ts frontend/vitest.config.ts frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json frontend/tsconfig.test.json ./
COPY frontend/plugins ./plugins
COPY frontend/src ./src
COPY frontend/public ./public
EXPOSE 5173
CMD ["corepack", "pnpm", "dev", "--host", "0.0.0.0"]

# Stage 3: Production build
FROM node:22-alpine AS build
WORKDIR /tmp/app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
COPY --from=deps /tmp/app/node_modules ./node_modules
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
COPY frontend/index.html frontend/vite.config.ts frontend/vitest.config.ts frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json frontend/tsconfig.test.json ./
COPY api/generated/api-types.ts /tmp/api/generated/api-types.ts
COPY frontend/plugins ./plugins
COPY frontend/src ./src
COPY frontend/public ./public
RUN corepack enable pnpm && corepack pnpm build

# Stage 4: Production runtime - nginx serving static files
FROM nginxinc/nginx-unprivileged:stable-alpine AS prod
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /tmp/app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]