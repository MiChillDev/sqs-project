# Stage 1: Shared dependencies
FROM node:22-alpine AS deps
WORKDIR /tmp/app
ENV HOME=/tmp/node-home \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN mkdir -p "$HOME"
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack pnpm install --frozen-lockfile

# Stage 2: Development mode - Vite dev server with hot reload
FROM node:22-alpine AS dev
WORKDIR /app
ENV HOME=/tmp/node-home \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN mkdir -p "$HOME"
COPY --from=deps /tmp/app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY index.html vite.config.ts vitest.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json tsconfig.test.json openapi.yaml ./
COPY plugins ./plugins
COPY src ./src
COPY public ./public
RUN chown -R node:node "$HOME" /app/node_modules
USER node
EXPOSE 5173
CMD ["corepack", "pnpm", "dev", "--host", "0.0.0.0"]

# Stage 3: Production build
FROM node:22-alpine AS build
WORKDIR /tmp/app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN mkdir -p "$HOME"
COPY --from=deps /tmp/app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY index.html vite.config.ts vitest.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json tsconfig.test.json openapi.yaml ./
COPY plugins ./plugins
COPY src ./src
COPY public ./public
RUN corepack enable pnpm && corepack pnpm build

# Stage 4: Production runtime - nginx serving static files
FROM nginxinc/nginx-unprivileged:stable-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /tmp/app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]