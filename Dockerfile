FROM python:3.10-alpine

ENV TZ=America/Sao_Paulo

RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

RUN pip install --upgrade pip 
RUN apk add gcc libc-dev g++ libffi-dev libxml2 unixodbc-dev

RUN mkdir /app
ADD . /app

WORKDIR /app
RUN pip install -r requirements.txt
CMD ["flask", "run"]