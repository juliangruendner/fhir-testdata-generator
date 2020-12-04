FROM node:14-alpine
WORKDIR /opt/testdata-generator
RUN mkdir input
COPY package.json package.json

COPY src ./src
RUN npm install
RUN mkdir output

ENTRYPOINT [ "node", "src/generator.js" ]
LABEL org.opencontainers.image.source="https://gitlab.miracum.org/miracum/fhir/fhir-testdata-generator"