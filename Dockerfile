FROM node:16-bullseye-slim as client

WORKDIR /build
COPY client/package.json .

RUN npm install

COPY client/ .

RUN npm build

# FROM python:3.8-slim-bullseye
#
# WORKDIR /app
#
# COPY requirements.txt .
# RUN pip install -r requirements.txt
#
# COPY . .
#
# ENV PORT=3000
# EXPOSE 3000
#
# CMD ["python", "app.py"]