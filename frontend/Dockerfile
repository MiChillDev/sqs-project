# Install dependencies
FROM node:22-alpine AS deps
USER node
WORKDIR /tmp/app
ENV HOME=/tmp/node-home \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN mkdir -p "$HOME" /tmp/app
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack pnpm install --frozen-lockfile

# Build application
FROM node:22-alpine AS build
USER node
WORKDIR /tmp/app
ENV HOME=/tmp/node-home \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN mkdir -p "$HOME" /tmp/app
COPY --from=deps --chown=node:node /tmp/app/node_modules ./node_modules
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=node:node index.html vite.config.* tsconfig*.json openapi.yaml ./
COPY --chown=node:node plugins ./plugins
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
RUN corepack pnpm build

# Final image
FROM nginxinc/nginx-unprivileged:stable-alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /tmp/app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]