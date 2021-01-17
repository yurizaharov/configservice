FROM node:14.15.1-alpine3.12

ADD . /webapp/liquicheck

RUN apk add tzdata curl && \
    ln -s /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
    rm -rf /var/cache/apk/* && \
    cd /webapp/liquicheck && npm i

EXPOSE 8080

WORKDIR /webapp/liquicheck

CMD ["npm","start"]