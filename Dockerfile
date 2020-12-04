FROM node:12

WORKDIR /opt/testdata-generator

COPY src ./src
RUN mkdir input
COPY package.json package.json

RUN npm install
RUN mkdir output

ENTRYPOINT [ "node", "src/generator.js" ]