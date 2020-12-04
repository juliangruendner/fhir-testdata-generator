FROM node:14-alpine
WORKDIR /opt/testdata-generator
RUN mkdir input
COPY package.json package.json

COPY src ./src
RUN npm install
RUN mkdir output

COPY docker-entrypoint.sh .
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
LABEL org.opencontainers.image.source="https://gitlab.miracum.org/miracum/fhir/fhir-testdata-generator"