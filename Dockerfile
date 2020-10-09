FROM node:12

# Create app directory
WORKDIR /opt/testdata-generator

COPY src ./src
COPY input ./input
COPY package.json package.json

RUN npm install
RUN mkdir output

ENTRYPOINT [ "node", "src/generator.js" ]