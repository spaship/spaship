FROM node:18-alpine3.16

ARG USERGROUP
RUN echo "USERGROUP: $USERGROUP"
RUN addgroup allusers && adduser -S -G allusers $USERGROUP
RUN mkdir /.npm
WORKDIR /app
COPY . .
RUN mkdir spaship_uploads && mkdir root
RUN npm install
RUN npm run build
RUN chown -R $USERGROUP:allusers .
RUN chown -R $USERGROUP:allusers ~/.npm
RUN chown -R $USERGROUP:allusers /.npm
RUN chmod -R 777 .
EXPOSE 2345
USER $USERGROUP
CMD [ "npm", "run", "start:prod"]