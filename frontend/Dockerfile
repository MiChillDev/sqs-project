FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@10.12.1 \
    && chown -R node:node /app

COPY --chmod=644 package.json pnpm-lock.yaml pnpm-workspace.yaml ./

USER node

RUN pnpm install --frozen-lockfile

COPY --chmod=644 . .
#COPY . .

#RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
#    && chown -R appuser:appgroup /app
#USER appuser

EXPOSE 5173

# TODO: add multi-stage production build
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
