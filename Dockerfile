FROM node:14.15.4-buster-slim

ADD . /webapp/configservice

RUN set -eux; \
    apt update; \
    apt install curl libaio1 -y; \
    apt clean all; \
    rm -f /etc/localtime; \
    ln -s /usr/share/zoneinfo/Europe/Moscow /etc/localtime; \
    echo "Europe/Moscow" > /etc/timezone; \
    mkdir -p /opt/oracle; \
    mv /webapp/configservice/instantclient_21_1 /opt/oracle/instantclient_21_1

RUN cd /webapp/configservice && npm i

EXPOSE 8080

WORKDIR /webapp/configservice

CMD ["npm","start"]