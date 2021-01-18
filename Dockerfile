FROM node:14.15.4-buster-slim

ADD . /webapp/liquicheck

RUN set -eux; \
    apt update; \
    apt install curl libaio1 -y; \
    apt clean all; \
    rm -f /etc/localtime; \
    ln -s /usr/share/zoneinfo/Europe/Moscow /etc/localtime; \
    echo "Europe/Moscow" > /etc/timezone; \
    mkdir -p /opt/oracle; \
    mv /webapp/liquicheck/instantclient_21_1 /opt/oracle/instantclient_21_1

RUN cd /webapp/liquicheck && npm i

EXPOSE 8080

WORKDIR /webapp/liquicheck

CMD ["npm","start"]