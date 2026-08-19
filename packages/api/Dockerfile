# ---- Build stage: install all dependencies and compile TypeScript ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
# Strip devDependencies so only production packages are carried into the runtime image
RUN npm prune --omit=dev

# ---- Runtime stage: production dependencies + compiled output only ----
FROM node:20-alpine

ARG USERGROUP
RUN apk add --no-cache p7zip
RUN echo "USERGROUP: $USERGROUP"
RUN addgroup allusers && adduser -S -G allusers $USERGROUP
RUN mkdir /.npm
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
RUN mkdir spaship_uploads && mkdir root
RUN chown -R $USERGROUP:allusers .
RUN chown -R $USERGROUP:allusers ~/.npm
RUN chown -R $USERGROUP:allusers /.npm
RUN chmod -R 777 .
EXPOSE 2345
USER $USERGROUP
CMD [ "npm", "run", "start:prod"]
