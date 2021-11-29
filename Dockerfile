# BUILD APP
FROM node:14 as build-client


WORKDIR /usr/local/app


COPY ./client /usr/local/app/

RUN npm install

RUN npm run build


# BUILD API
FROM python:3.8-slim-bullseye

WORKDIR /app

COPY ./backend/requirements.txt .

RUN pip install -r requirements.txt

COPY ./backend .

ENV PORT=5000

EXPOSE 5000

COPY --from=build-client /usr/local/app/dist/ ./static

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["sh", "entrypoint.sh"]

