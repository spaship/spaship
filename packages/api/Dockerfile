FROM node:18-alpine3.16

RUN addgroup allusers && adduser -S -G allusers 1002590000
RUN mkdir /.npm
WORKDIR /app
COPY . .
RUN mkdir spaship_uploads && mkdir root
RUN npm install
RUN npm run build
RUN chown -R 1002590000:allusers .
RUN chown -R 1002590000:allusers ~/.npm
RUN chown -R 1002590000:allusers /.npm
RUN chmod -R 777 .
EXPOSE 2345
USER 1002590000
CMD [ "npm", "run", "start:prod"]
