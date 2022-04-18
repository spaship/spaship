
FROM ubuntu:20.04

RUN apt-get update
RUN apt-get --force-yes upgrade  -y
RUN apt-get dist-upgrade
RUN apt-get  install -y build-essential
RUN apt-get install sudo

RUN apt-get install --yes curl
RUN apt update
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN apt-get  --force-yes install -y nodejs
RUN apt-get install --yes build-essential
RUN apt-get install --only-upgrade bash
RUN node -v

RUN mkdir app
RUN sudo chown -R $USER:$(id -gn $USER) /app
USER $USER

RUN sudo mkdir ~/.config
RUN sudo chown -R $USER:$(id -gn $USER) ~/.config

ADD  . /app
WORKDIR /app

RUN find . -name "node_modules" -exec rm -rf '{}' +
RUN find . -name ".next" -exec rm -rf '{}' +
RUN sudo chmod -R 777 /app
RUN sudo ls && npm install
RUN sudo ls && npm run build
RUN sudo chmod -R 777 /app
EXPOSE 2468

CMD [ "npm", "run", "start"]