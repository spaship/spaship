# Dockerfile modified from: https://github.com/vercel/next.js/tree/canary/examples/with-docker
# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm i --force 
#TO DO: remove this flag and chnage to npm ci

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SPASHIP_API_BASE_URL
ARG NEXT_PUBLIC_SPASHIP_INTRO_VIDEO_URL
ARG NEXT_PUBLIC_SPASHIP_FEEDBACK_FORM_URL
ARG NEXT_PUBLIC_SPASHIP_FAQ_URL
ARG NEXT_PUBLIC_SPASHIP_LIGHTHOUSE_URL
ARG NEXT_PUBLIC_SPASHIP_GIT_BROKER_URL
ARG NEXT_PUBLIC_SPASHIP_MANAGER_CLI_GUIDE
ARG NEXT_PUBLIC_ONBOARDING_TO_CLOUD_LINK
ARG NEXT_PUBLIC_CONTAINERIZED_DEPLOYMENTS_WORKFLOW_VIDEO
ARG NEXT_PUBLIC_SPASHIP_CLI_INSTRUCTIONS
ARG NEXT_PUBLIC_SPASHIP_DOCBOT_FEEDBACK
ARG NEXT_PUBLIC_DOC_URL
ARG NEXT_PUBLIC_SPASHIP_QUERY_STREAM_URL
ARG NEXT_PUBLIC_SPASHIP_GUIDE

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 2468

ENV PORT 2468

CMD ["node", "server.js"]
