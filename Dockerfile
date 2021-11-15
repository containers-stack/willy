FROM node:14 as client

WORKDIR /build
COPY client/package.json .

RUN npm install

COPY client/ .

RUN npm run build

FROM python:3.8-slim-bullseye

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

COPY --from=client /build/dist/ /app/static
#COPY --from=client /build/dist/index.html /app/templates/index.html

ENV PORT=3000
EXPOSE 3000

CMD ["python", "app.py"]
