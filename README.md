# FHIR TESTDATA GENERATOR

## SIMPLE TESTDATE GENERATOR

this is a simple fhir testdata generator, which takes patient descriptions from /input and uses the resource blueprints as specified in
the src/config/resource-blueprints.json file to generate testdata.

It does this by changing the blueprint resources as specified in the patient descriptions in the input folder.


## RUN INSIDE DOCKER - FOR DEV

Start the nodejs docker container for development: `docker-compose -f docker-compose.dev.yml`

connect to development docker container `docker-compose -f docker-compose.dev.yml exec testdatagenerator bash`

and execute the testdata generator inside the container `node src/generator.js`


## RUN WITHOUT DOCKER - FOR DEV

Note: this requires one to install nodejs on your machine before the programm can be executed

Run the generator using the following command:

`npm install`
`node src/generator.js`

=> This will download the dependencies and execute the generator.
The generated JSON FHIR resources can then be found in the /output folder in the genData.json file as newline delimited JSON strings


## DEPLOY FOR REGULAR GENERATION USE

`docker-compose up`
