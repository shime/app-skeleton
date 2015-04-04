FROM base/archlinux:latest

# install dependencies
RUN pacman -Sy --noconfirm
RUN pacman -S --noconfirm pacman
RUN pacman-db-upgrade
RUN pacman-key --refresh-keys
RUN pacman -Syu --noconfirm
RUN pacman --noconfirm -S base-devel yajl nodejs git openssh

# global dependencies
RUN npm install -g bower

# reduce memory usage
RUN npm config set jobs 1

# cache npm install
WORKDIR /tmp
ADD package.json /tmp/package.json
ADD npm-shrinkwrap.json /tmp/npm-shrinkwrap.json
RUN npm install --production

# cache bower install
ADD bower.json /tmp/bower.json
RUN bower install --allow-root --config.interactive=false

ADD . /opt/www
RUN cp -a /tmp/node_modules /opt/www && cp -a /tmp/bower_components /opt/www/public/vendor

CMD NODE_ENV=production node /opt/www/bin/www
