FROM node:22-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.1.2 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile && chown -R appuser:appgroup /app/node_modules

COPY src/ ./src/
COPY public/ ./public/
COPY plugins/ ./plugins/
COPY index.html vite.config.ts components.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY openapi.yaml ./

USER appuser

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]
