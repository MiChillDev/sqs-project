FROM node:22-alpine AS deps
WORKDIR /tmp/app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack pnpm install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /tmp/app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
COPY --from=deps /tmp/app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY openapi.yaml ./
COPY plugins ./plugins
COPY src ./src
COPY public ./public
RUN corepack pnpm build

FROM nginxinc/nginx-unprivileged:stable-alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /tmp/app/dist /usr/share/nginx/html
EXPOSE 8080