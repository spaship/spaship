FROM node:18-alpine3.16

# Create a new group and user with a specific UID for the application
RUN addgroup -g 1001 appgroup && adduser -S -u 1001 -G appgroup appuser


WORKDIR /app

COPY package*.json ./

# Install both production and development dependencies TODO this was a workaround; get rid of devDependencies
RUN npm ci

COPY . .

RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Change ownership of the application files to the new user
RUN chown -R appuser:appgroup /app

# Create necessary directories and set ownership
RUN mkdir spaship_uploads root && chown -R appuser:appgroup spaship_uploads root

# Run the application as a non-root user
USER appuser

EXPOSE 2345

CMD [ "npm", "run", "start:prod"]
