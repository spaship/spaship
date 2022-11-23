FROM ubuntu:20.04

RUN apt-get update
RUN apt-get --force-yes upgrade  -y
RUN apt-get dist-upgrade
RUN apt-get install sudo

RUN sudo apt-get install --yes curl
RUN sudo apt update
RUN sudo curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
RUN sudo apt-get --force-yes install -y nodejs
RUN sudo apt-get install --yes build-essential
RUN sudo apt-get update

RUN mkdir app && mkdir app/spaship_uploads && mkdir app/root
RUN sudo chown -R $USER:$(id -gn $USER) /app
USER $USER

RUN sudo mkdir ~/.config
RUN sudo chown -R $USER:$(id -gn $USER) ~/.config

ADD . /app
WORKDIR /app

RUN find . -name "node_modules" -exec rm -rf '{}' +

RUN sudo npm install -g npm-check-updates
RUN npm cache clean --force
RUN sudo chmod -R 777 /app
RUN ls && npm install

EXPOSE 2345

CMD [ "npm", "run", "start"]