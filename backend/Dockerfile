################
# BUILD CLIENT #
################
# Build angular client
FROM node:14 as client

WORKDIR /build

COPY client/package.json .
RUN npm install

COPY client/ .
RUN npm run build

###############
#  BUILD API  #
###############
# Build runtime image
FROM python:3.8-slim-bullseye

WORKDIR /app

# Install python requirements
COPY requirements.txt .
RUN pip install -r requirements.txt

# COPY the python app *also copies angular files before build
COPY . .

# Copy the built angular files
COPY --from=client /build/dist/ /app/static

ENV PORT=5000

EXPOSE 5000

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["sh", "entrypoint.sh"]

