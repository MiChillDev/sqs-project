# Stage 1: Shared dependencies
FROM node:22-alpine AS deps
USER node
WORKDIR /tmp/app
ENV HOME=/tmp/node-home \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN mkdir -p "$HOME" /tmp/app
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack pnpm install --frozen-lockfile

# Stage 2: Development mode - Vite dev server with hot reload
FROM node:22-alpine AS dev
USER node
WORKDIR /app
ENV HOME=/tmp/node-home \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN mkdir -p "$HOME" /app
COPY --from=deps --chown=node:node /tmp/app/node_modules ./node_modules
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=node:node index.html vite.config.* tsconfig*.json openapi.yaml ./
COPY --chown=node:node plugins ./plugins
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
EXPOSE 5173
CMD ["corepack", "pnpm", "dev", "--host", "0.0.0.0"]

# Stage 3: Production build
FROM node:22-alpine AS build
USER node
WORKDIR /tmp/app
ENV HOME=/tmp/node-home \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN mkdir -p "$HOME" /tmp/app
COPY --from=deps --chown=node:node /tmp/app/node_modules ./node_modules
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=node:node index.html vite.config.* tsconfig*.json openapi.yaml ./
COPY --chown=node:node plugins ./plugins
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
USER root
RUN corepack enable pnpm
USER node
RUN corepack pnpm build

# Stage 4: Production runtime - nginx serving static files
FROM nginxinc/nginx-unprivileged:stable-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /tmp/app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
