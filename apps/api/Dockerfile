FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
COPY prisma/ ./prisma/
COPY scripts/ ./scripts/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @bis/api run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

ENV PORT=4000
ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "apps/api/dist/main"]
