FROM ubuntu:20.04

RUN apt-get update
RUN apt-get --force-yes upgrade  -y
RUN apt-get dist-upgrade
RUN apt-get  install -y build-essential
RUN apt-get install sudo

RUN sudo apt-get install --yes curl
RUN sudo apt update
RUN sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN sudo apt-get --force-yes install -y nodejs
RUN sudo apt-get install --yes build-essential
RUN sudo apt-get install --only-upgrade bash
RUN sudo apt --force-yes install -y libssl-dev
RUN sudo apt-get --force-yes install -y libpcre3 libpcre3-dev
RUN sudo apt-get install libssl-dev
RUN sudo apt --force-yes install  -y libgit2-dev

RUN sudo dpkg --add-architecture i386
RUN sudo apt-get update
RUN sudo apt-get --force-yes install -y libstdc++6:i386 libgcc1:i386 libcurl4-gnutls-dev:i386
RUN node -v

RUN mkdir app && mkdir app/tmp && mkdir app/tmp/spaship_uploads && mkdir app/root
RUN sudo chown -R $USER:$(id -gn $USER) /app
USER $USER

RUN sudo mkdir ~/.config
RUN sudo chown -R $USER:$(id -gn $USER) ~/.config

ADD . /app
WORKDIR /app

RUN find . -name "node_modules" -exec rm -rf '{}' +
RUN rm -rf '/app/package-lock.json'

RUN sudo apt-get install nodejs
RUN sudo npm install -g npm-check-updates
RUN npm cache clean --force
RUN sudo chmod -R 777 /app
RUN ls && npm install

EXPOSE 2345

CMD [ "npm", "run", "start"]